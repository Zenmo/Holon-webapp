# Generated by Django 4.1.7 on 2023-03-30 11:43

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("holon", "0026_alter_ruleactionchangeattribute_static_value"),
    ]

    operations = [
        migrations.AddField(
            model_name="contract",
            name="name",
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
