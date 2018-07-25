from django.db import models
from django.contrib.auth.models import User
from django import utils


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ost_id = models.TextField(blank=True)


class Task(models.Model):
    created_time = models.DateTimeField(default=utils.timezone.now)
    end_time = models.DateTimeField()
    description = models.TextField(blank=True)
    reward = models.FloatField()
    title = models.TextField()
    type = models.TextField()
    total_cost = models.IntegerField(blank=True)
    amount = models.IntegerField()
    active = models.BooleanField(default=True)

    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, blank=True)
    completions = models.ManyToManyField(User, related_name='completions', blank=True)


class LiveTask(models.Model):
    task = models.ForeignKey(Task, on_delete=models.DO_NOTHING)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    timestamp = models.DateTimeField(default=utils.timezone.now)
