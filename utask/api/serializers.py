from rest_framework import serializers
from api.models import Task, LiveTask, Profile, TaskReward
from django.contrib.auth.models import User
from api.utils import de_camelcase_ilator


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

    def to_internal_value(self, data):
        return super().to_internal_value(de_camelcase_ilator(data))


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = '__all__'
