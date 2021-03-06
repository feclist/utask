from api.models import Task, LiveTask, TaskReward
from api.serializers import TaskSerializer, UserSerializer, LiveTaskSerializer, TaskRewardSerializer
from api.permissions import IsCreatOrIsAuthenticated
from rest_framework import viewsets, status, permissions, views
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from decouple import config

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.conf import settings

from api.utils import flatten_query_set, get_ost_kit, calc_effective_funds


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        request.data["user"] = request.user.pk
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.data["total_cost"] = int(
            request.data["amount"]) * float(request.data["reward"])

        response = get_ost_kit().balances.retrieve(user_id=request.user.profile.ost_id)

        if not response["success"]:
            return Response({'message': 'Something went wrong with creating the task', 'err': response["err"]},
                            status=status.HTTP_409_CONFLICT)

        # See if there's enough funds
        if calc_effective_funds(response["data"]["balance"]["available_balance"], request.user) >= request.data[
                "total_cost"]:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        return Response({'message': 'Insufficient balance to fund this task'}, status=status.HTTP_409_CONFLICT)

    @action(methods=['get'], detail=True)
    def start_task(self, request, pk=None):
        task = self.get_object()
        user = request.user

        # Check if the user is not trying to do own task
        if task.user.pk == user.pk:
            return Response({'message': 'You cannot do your own task, silly.'},
                            status=status.HTTP_409_CONFLICT)

        # Check if the user didn't already finish this task
        if task.completions.filter(user__pk=user.pk).exists():
            return Response({'message': 'You already finished this task, you cannot do it again'},
                            status=status.HTTP_409_CONFLICT)

        # Check if user can start any more tasks
        if len(flatten_query_set(user.livetask_set)) >= settings.MAX_ACTIVE_TASKS:
            return Response({'message': 'You cannot start any more tasks, finish or cancel tasks before proceeding'},
                            status=status.HTTP_409_CONFLICT)

        # Check if a new user can start the task
        if len(flatten_query_set(task.completions)) >= task.amount or not task.active:
            return Response({'message': 'This task cannot be started'}, status=status.HTTP_409_CONFLICT)

        live_task = LiveTask(task=task, user=user)
        live_task.save()
        serializer = LiveTaskSerializer(live_task)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False)
    def retrieve_user_tasks(self, request):
        user = request.user
        live_tasks = user.livetask_set.all()
        completed_tasks = user.taskreward_set.all()

        return Response(
            {
                'completed_tasks': TaskSerializer([task_reward.task for task_reward in completed_tasks], many=True).data,
                'live_tasks': TaskSerializer([live_task.task for live_task in live_tasks], many=True).data
            }, status=status.HTTP_200_OK)

    # PROBLEM HERE IS THAT YOU CAN GIVE ANY ID AND THERES NO CHECK WHETHER THIS USER 
    # IS ACTUALLY ALLOWED TO ASK DATA BELONGING TO THOSE ACTIVE TASKS
    @action(methods=['get'], detail=True)
    def retrieve_from_live_task(self, request, pk=None):
        live_task = LiveTask.objects.get(pk=pk)
        return Response(TaskSerializer(live_task.task), status=status.HTTP_200_OK)

    # SOME GOES FOR THIS ONE
    @action(methods=['get'], detail=True)
    def retrieve_from_completed_task(self, request, pk=None):
        completed_task = TaskReward.objects.get(pk=pk)
        return Response(TaskSerializer(completed_task.task), status=status.HTTP_200_OK)


class LiveTaskReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LiveTask.objects.all()
    serializer_class = LiveTaskSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @action(methods=['get'], detail=True)
    def complete_task(self, request, pk=None):
        live_task = self.get_object()

        task = live_task.task
        response = get_ost_kit().transactions.execute(from_user_id=task.user.profile.ost_id,
                                                      to_user_id=live_task.user.profile.ost_id,
                                                      action_id=39046,
                                                      amount=task.reward)
        if response["success"]:
            task_reward = TaskReward(transaction_id=response["data"]["transaction"]["id"],
                                     user=live_task.user,
                                     task=task)
            task_reward.save()
            live_task.delete()

            return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)
        return Response({"message": "Something went wrong when completing the task", 'err': response["err"]},
                        status=status.HTTP_409_CONFLICT)

    # PROBLEM HERE IS THAT YOU CAN GIVE ANY ID AND THERES NO CHECK WHETHER THIS USER 
    # IS ACTUALLY ALLOWED TO ASK DATA BELONGING TO THOSE ACTIVE TASKS
    @action(methods=['get'], detail=True)
    def retrieve_from_task(self, request, pk=None):
        task = Task.objects.get(pk=pk)
        return Response(LiveTaskSerializer(request.user.livetask_set.get(task__pk=task.id)).data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsCreatOrIsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        response = get_ost_kit().users.create(
            name=serializer.validated_data["username"])

        if response["success"]:
            user = User.objects.create_user(**request.data)

            user.profile.ost_id = response["data"]["user"]["id"]
            user.save()

            return Response({'token': Token.objects.get(user_id=user.pk).key}, status=status.HTTP_200_OK)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(methods=['get'], detail=False)
    def me(self, request, pk=None):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


@api_view(['GET'])
def effective_funds(request):
    response = get_ost_kit().balances.retrieve(user_id=request.user.profile.ost_id)

    if response["success"]:
        return Response({'effective_funds': calc_effective_funds(response["data"]["balance"]["available_balance"], request.user)}, status=status.HTTP_200_OK)

    return Response({"message": "Something went wrong when retrieving the effective funds", 'err': response["err"]},
                    status=status.HTTP_409_CONFLICT)


@api_view(['GET'])
def wallet_detail(request):
    response = get_ost_kit().balances.retrieve(user_id=request.user.profile.ost_id)

    if response["success"]:
        return Response(response['data'], status=status.HTTP_200_OK)

    return Response({"message": "Something went wrong when retrieving the wallet", 'err': response["err"]},
                    status=status.HTTP_409_CONFLICT)


@api_view(['POST'])
def buy_tokens_from_company(request, amount):
    response = get_ost_kit().balances.retrieve(user_id=request.user.profile.ost_id)
    # This hardcoded check makes sure users won't be able to spam crazy amounts
    # to be added to their wallet, making us go bankrupt :). This will be deleted
    # if we'll actually implement a proper buy-in system.
    if calc_effective_funds(response["data"]["balance"]["available_balance"], request.user) <= 60 and float(
            amount) <= 50:
        response = get_ost_kit().transactions.execute(from_user_id=config('COMPANY_UUID'),
                                                      to_user_id=request.user.profile.ost_id,
                                                      action_id=39580,
                                                      amount=amount)
        if response["success"]:
            return Response({"message": "You boughnt {} muT".format(amount)}, status=status.HTTP_200_OK)
        return Response({"message": "Something went wrong when buying", 'err': response["err"]},
                        status=status.HTTP_409_CONFLICT)

    return Response({"message": "You cannot buy that many tokens"}, status=status.HTTP_409_CONFLICT)


@api_view(['POST'])
def sell_tokens_to_company(request, amount):
    response = get_ost_kit().balances.retrieve(user_id=request.user.profile.ost_id)
    if calc_effective_funds(response["data"]["balance"]["available_balance"], request.user) >= float(amount):
        response = get_ost_kit().transactions.execute(from_user_id=request.user.profile.ost_id,
                                                      to_user_id=config(
                                                          'COMPANY_UUID'),
                                                      action_id=39581,
                                                      amount=amount)
        if response["success"]:
            return Response({"message": "You sold {} muT".format(amount)}, status=status.HTTP_200_OK)

    return Response({"message": "You cannot sell more tokens than you have", 'err': response["err"]},
                    status=status.HTTP_409_CONFLICT)


@api_view(['GET'])
def list_transactions(request):
    response = get_ost_kit().ledger.retrieve(user_id=request.user.profile.ost_id, limit=100)

    if response["success"]:
        actions = get_ost_kit().actions.list()
        action_list = {
            int(action["id"]): action for action in actions["data"]["actions"]}
        data = response["data"]["transactions"]
        for transaction in data:
            reward = TaskReward.objects.filter(
                transaction_id=transaction["id"]).first()
            if reward:
                transaction["task_id"] = reward.task.id
            transaction["action"] = action_list[int(transaction["action_id"])]
        return Response(response['data'], status=status.HTTP_200_OK)

    return Response({"message": "Something went wrong when retrieving the transactions", 'err': response["err"]},
                    status=status.HTTP_409_CONFLICT)


@api_view(['GET'])
def retrieve_transaction(request, transaction_id):
    response = get_ost_kit().transactions.retrieve(transaction_id=transaction_id)

    if response["success"]:
        return Response(response["data"], status=status.HTTP_200_OK)

    return Response({"message": "Something went wrong when retrieving the transaction", 'err': response["err"]},
                    status=status.HTTP_409_CONFLICT)

@api_view(['GET'])
def list_tasks_from_user(request):
    return Response(TaskSerializer(request.user.task_set.all(), many=True).data, status=status.HTTP_200_OK)