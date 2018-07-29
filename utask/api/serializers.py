from rest_framework import serializers
from api.models import Task, LiveTask, Profile
from django.contrib.auth.models import User


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = '__all__'


class LiveTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveTask
        fields = '__all__'
