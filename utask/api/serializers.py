from rest_framework import serializers
from api.models import Task, LiveTask
from django.contrib.auth.models import User


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class LiveTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveTask
        fields = '__all__'
