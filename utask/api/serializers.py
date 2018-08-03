from rest_framework import serializers
from api.models import Task, LiveTask, Profile, TaskReward
from django.contrib.auth.models import User


class TaskRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskReward
        fields = '__all__'


class LiveTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveTask
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    completions = TaskRewardSerializer(many=True, read_only=True)
    live_tasks = LiveTaskSerializer(many=True, read_only=True)

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
