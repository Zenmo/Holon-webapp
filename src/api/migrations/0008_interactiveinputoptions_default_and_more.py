# Generated by Django 4.1.3 on 2022-12-02 10:05

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0007_interactiveinputoptions_label"),
    ]

    operations = [
        migrations.AddField(
            model_name="interactiveinputoptions",
            name="default",
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="interactiveinputoptions",
            name="label",
            field=models.CharField(
                blank=True,
                help_text="Fill in the label that the user sees in a storyline",
                max_length=255,
                null=True,
            ),
        ),
    ]
