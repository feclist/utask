from api.models import Task, LiveTask
from api.serializers import TaskSerializer, UserSerializer, LiveTaskSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from django.contrib.auth.models import User
from django.conf import settings

from decouple import config

from ost_kit_python import OSTKit

from api.utils import flatten_query_set


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    @action(methods=['get'], detail=True)
    def start_task(self, request, pk=None):
        task = self.get_object()
        # TODO: Implement auth in order to use request.user instead of gross hardcode
        user = User.objects.get(pk=6)

        # Check if the user didn't already finish this task
        if task.completions.filter(pk=user.pk).exists():
            return Response({'message': 'You already finished this task, you cannot do it again'},
                            status=status.HTTP_409_CONFLICT)

        # TODO: Remove the hardcoded 5 here to a general setting
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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ostkit = OSTKit(api_url='https://sandboxapi.ost.com/v1.1',
                        api_key=config('API_KEY'),
                        api_secret=config('API_SECRET'))

        response = ostkit.users.create(name=serializer.validated_data["username"])

        if response["success"]:
            user = serializer.save()

            user.profile.ost_id = response["data"]["user"]["id"]
            user.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
