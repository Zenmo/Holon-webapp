# Generated by Django 4.1.7 on 2023-03-10 08:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0017_alter_interactiveinput_level"),
    ]

    operations = [
        migrations.AlterField(
            model_name="interactiveinput",
            name="asset_type",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]