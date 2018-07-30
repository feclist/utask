# Generated by Django 2.0.7 on 2018-07-22 21:58

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wallet_id', models.TextField(blank=True)),
                ('tasks', models.CharField(blank=True, max_length=30)),
                ('completed_tasks', models.DateField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_time', models.DateTimeField(default=datetime.datetime(2018, 7, 22, 21, 58, 41, 816090))),
                ('end_time', models.DateTimeField()),
                ('summary', models.TextField(blank=True)),
                ('reward', models.FloatField(blank=True)),
                ('title', models.TextField()),
                ('type', models.TextField()),
                ('total_cost', models.IntegerField()),
                ('amount', models.IntegerField()),
                ('completions', models.ManyToManyField(related_name='completions', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
