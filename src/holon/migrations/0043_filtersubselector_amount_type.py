# Generated by Django 4.1.9 on 2023-06-06 14:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("holon", "0042_alter_buildinggridconnection_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="filtersubselector",
            name="amount_type",
            field=models.CharField(
                choices=[("ABSOLUTE", "Absolute"), ("RELATIVE", "Relative")],
                default="ABSOLUTE",
                max_length=32,
            ),
            preserve_default=False,
        ),
    ]
