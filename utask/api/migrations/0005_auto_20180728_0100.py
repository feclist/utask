# Generated by Django 2.0.7 on 2018-07-28 01:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_task_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='completions',
            field=models.ManyToManyField(blank=True, related_name='completions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='task',
            name='reward',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='task',
            name='total_cost',
            field=models.IntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='user',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
    ]
