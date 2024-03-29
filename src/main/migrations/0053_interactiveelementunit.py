# Generated by Django 4.1.7 on 2023-03-24 09:42

import autoslug.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0052_alter_challengemodepage_feedbackmodals"),
    ]

    operations = [
        migrations.CreateModel(
            name="InteractiveElementUnit",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "slug",
                    autoslug.fields.AutoSlugField(editable=False, populate_from="name"),
                ),
                (
                    "icon",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("book", "Book"),
                            ("bell", "Bell"),
                            ("cog", "Cog"),
                            ("folder", "Folder"),
                            ("heart", "Heart"),
                            ("info", "Info"),
                            ("lightning", "Lightning bolt"),
                            ("mapmarker", "Map marker"),
                            ("rocket", "Rocket"),
                            ("star", "Star"),
                            ("user", "User"),
                        ],
                        default="green",
                        help_text="Icon shown in storyline overview page",
                        max_length=20,
                    ),
                ),
                ("name", models.CharField(max_length=50)),
                ("symbol", models.CharField(max_length=10)),
            ],
            options={
                "verbose_name": "Unit",
                "verbose_name_plural": "Units",
                "ordering": ["name"],
            },
        ),
    ]
