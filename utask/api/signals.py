from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from api.models import Profile, Task
from api.utils import flatten_query_set


@receiver(post_save, sender=User)
def init_new_user(sender, instance, signal, created, **kwargs):
    if created:
        Token.objects.create(user=instance)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


@receiver(post_save, sender=Task)
def task_save_check(sender, instance, **kwargs):
    if instance.amount == len(flatten_query_set(instance.completions)) and instance.active:
        instance.active = False
        instance.save()
