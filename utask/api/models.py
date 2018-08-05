from django.db import models
from django.contrib.auth.models import User
from django import utils
from django.core.validators import MinValueValidator


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ost_id = models.TextField(blank=True)


class Task(models.Model):
    created_time = models.DateTimeField(default=utils.timezone.now)
    end_time = models.DateTimeField()
    description = models.TextField()
    reward = models.FloatField(validators=[MinValueValidator(float('0'))])
    title = models.TextField()
    type = models.TextField(blank=True)
    total_cost = models.FloatField(blank=True)
    amount = models.IntegerField(validators=[MinValueValidator(1)])
    active = models.BooleanField(default=True)

    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, blank=True)


class LiveTask(models.Model):
    task = models.ForeignKey(Task, on_delete=models.DO_NOTHING, related_name="live_tasks")
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    timestamp = models.DateTimeField(default=utils.timezone.now)


class TaskReward(models.Model):
    transaction_id = models.TextField()

    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    task = models.ForeignKey(Task, related_name="completions", on_delete=models.DO_NOTHING)