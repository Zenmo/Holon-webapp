# Generated by Django 4.1.6 on 2023-02-10 09:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0015_alter_interactiveinputoptions_level"),
    ]

    operations = [
        migrations.AddField(
            model_name="interactiveinput",
            name="level",
            field=models.CharField(
                blank=True,
                choices=[
                    ("national", "National"),
                    ("intermediate", "Intermediate"),
                    ("local", "Local"),
                ],
                help_text="If type is 'Continuous (slider)', choose a level. Otherwise, leave ik empty",
                max_length=13,
                null=True,
            ),
        ),
    ]