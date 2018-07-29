from api.models import Task, LiveTask
from api.serializers import TaskSerializer, UserSerializer, LiveTaskSerializer
from rest_framework import viewsets, status, permissions, views
from rest_framework.response import Response
from rest_framework.decorators import action, api_view

from django.contrib.auth.models import User
from django.conf import settings

from api.utils import flatten_query_set, get_ost_kit, calc_effective_funds


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        request.data["user"] = request.user.pk
        request.data["total_cost"] = int(request.data["amount"] * request.data["reward"])
        request.data["completions"] = []

        response = get_ost_kit().balances.retrieve(user_id=request.user.profile.ost_id)

        if not response["success"]:
            return Response({'message': 'Something went wrong with creating the task'}, status=status.HTTP_409_CONFLICT)

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

        # Check if the user didn't already finish this task
        if task.completions.filter(pk=user.pk).exists():
            return Response({'message': 'You already finished this task, you cannot do it again'},
                            status=status.HTTP_409_CONFLICT)

        # Check if user can start any more tasks
        if len(flatten_query_set(user.livetask_set)) >= settings.MAX_ACTIVE_TASKS:
            return Response({'message': 'You cannot start any more tasks, finish or cancel tasks before proceeding'},
                            status=status.HTTP_409_CONFLICT)

        # Check if a new user can start the task
        if task.amount >= len(flatten_query_set(task.completions)) or not task.active:
            return Response({'message': 'This task cannot be started'}, status=status.HTTP_409_CONFLICT)

        live_task = LiveTask(task=task, user=user)
        live_task.save()
        serializer = LiveTaskSerializer(live_task)

        return Response(serializer.data, status=status.HTTP_200_OK)


class LiveTaskReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LiveTask.objects.all()
    serializer_class = LiveTaskSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @action(methods=['get'], detail=True)
    def complete_task(self, request, pk=None):
        live_task = self.get_object()

        task = live_task.task
        task.completions.add(live_task.user)
        task.save()

        live_task.delete()

        return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        response = get_ost_kit().users.create(name=serializer.validated_data["username"])

        if response["success"]:
            user = serializer.save()

            user.profile.ost_id = response["data"]["user"]["id"]
            user.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(methods=['get'], detail=False)
    def me(self, request, pk=None):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


# TODO: TEST THIS
@api_view(['GET'])
def wallet_detail(request):
    response = get_ost_kit().ledger.retrieve(user_id=request.user.profile.ost_id)

    if response["success"]:
        return Response(response['data'], status=status.HTTP_200_OK)

    return Response({"message": "Something went wrong when retrieving the wallet"}, status=status.HTTP_409_CONFLICT)


# TODO: TEST THIS
# TODO: Implement actual token transfer
@api_view(['POST'])
def buy_tokens_from_company(request, amount):
    response = get_ost_kit().balances.retrieve(user_id=request.user.profile.ost_id)
    # This hardcoded check makes sure users won't be able to spam crazy amounts
    # to be added to their wallet, making us go bankrupt :). This will be deleted
    # if we'll actually implement a proper buy-in system.
    if calc_effective_funds(response["data"]["balance"]["available_balance"], request.user) >= 30 and amount <= 50:
        return Response({"message": "You boughnt {} muT".format(amount)}, status=status.HTTP_200_OK)

    return Response({"message": "You cannot buy that many tokens"}, status=status.HTTP_409_CONFLICT)


# TODO: TEST THIS
# TODO: Implement actual token transfer
@api_view(['POST'])
def sell_tokens_to_company(request, amount):
    response = get_ost_kit().balances.retrieve(user_id=request.user.profile.ost_id)
    if calc_effective_funds(response["data"]["balance"]["available_balance"], request.user) >= amount:
        return Response({"message": "You sold {} muT".format(amount)}, status=status.HTTP_200_OK)

    return Response({"message": "You cannot sell more tokens than you have"}, status=status.HTTP_409_CONFLICT)


# TODO: TEST THIS
@api_view(['GET'])
def list_transactions(request):
    response = get_ost_kit().transactions.list(user_id=request.user.profile.ost_id)

    if response["success"]:
        return Response(response['data'], status=status.HTTP_200_OK)

    return Response({"message": "Something went wrong when retrieving the transactions"},
                    status=status.HTTP_409_CONFLICT)


# TODO: TEST THIS
@api_view(['GET'])
def retrieve_transaction(request, transaction_id):
    response = get_ost_kit().transactions.retrieve(transaction_id=transaction_id)

    if response["success"]:
        return Response(response['data'], status=status.HTTP_200_OK)

    return Response({"message": "Something went wrong when retrieving the transaction"},
                    status=status.HTTP_409_CONFLICT)

# class TransactionApiView(views.APIView):
#
#     def get(self, request):
#         ostkit = OSTKit(api_url='https://sandboxapi.ost.com/v1.1',
#                         api_key=config('API_KEY'),
#                         api_secret=config('API_SECRET'))
#
#         response = ostkit.transactions.list(user_id=request.user.profile.ost_id)
#
#         if response["success"]:
#             return Response(response['data'], status=status.HTTP_200_OK)
#
#         return Response({"message": "Something went wrong when retrieving the transactions"},
#                         status=status.HTTP_409_CONFLICT)
#
#     def get(self, request, pk):
#         ostkit = OSTKit(api_url='https://sandboxapi.ost.com/v1.1',
#                         api_key=config('API_KEY'),
#                         api_secret=config('API_SECRET'))
#
#         response = ostkit.transactions.retrieve(transaction_id=pk)
#
#         if response["success"]:
#             return Response(response['data'], status=status.HTTP_200_OK)
#
#         return Response({"message": "Something went wrong when retrieving the transaction"},
#                         status=status.HTTP_409_CONFLICT)
