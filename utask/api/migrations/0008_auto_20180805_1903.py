# Generated by Django 2.0.7 on 2018-08-05 19:03

import api.utils
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20180805_1751'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='bottom_color',
            field=models.TextField(default=api.utils.generate_bright_color),
        ),
        migrations.AddField(
            model_name='profile',
            name='top_color',
            field=models.TextField(default=api.utils.generate_bright_color),
        ),
        migrations.AlterField(
            model_name='task',
            name='amount',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AlterField(
            model_name='task',
            name='reward',
            field=models.FloatField(validators=[django.core.validators.MinValueValidator(0.0)]),
        ),
    ]
