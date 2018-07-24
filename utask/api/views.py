from api.models import Task
from api.serializers import TaskSerializer, UserSerializer
from rest_framework import generics, viewsets
from rest_framework import status
from rest_framework.response import Response

from django.contrib.auth.models import User

from decouple import config

from ost_kit_python import OSTKit


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


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
