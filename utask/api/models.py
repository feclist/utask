from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django import utils


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    wallet_id = models.TextField(blank=True)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class Task(models.Model):
    created_time = models.DateTimeField(default=utils.timezone.now)
    end_time = models.DateTimeField()
    summary = models.TextField(blank=True)
    reward = models.FloatField(blank=True)
    title = models.TextField()
    type = models.TextField()
    total_cost = models.IntegerField()
    amount = models.IntegerField()

    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    completions = models.ManyToManyField(User, related_name='completions')


class LiveTask(models.Model):
    task = models.ForeignKey(Task, on_delete=models.DO_NOTHING)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    timestamp = models.DateTimeField(default=utils.timezone.now)
