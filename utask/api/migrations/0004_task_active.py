# Generated by Django 2.0.7 on 2018-07-24 21:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20180724_1832'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
