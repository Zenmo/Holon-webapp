# Generated by Django 4.1.7 on 2023-03-30 12:42

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("holon", "0029_merge_20230330_1429"),
    ]

    operations = [
        migrations.AlterField(
            model_name="contract",
            name="name",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
