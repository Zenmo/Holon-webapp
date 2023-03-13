# Generated by Django 4.1.7 on 2023-02-21 13:51

import autoslug.fields
from django.db import migrations, models
import wagtail_color_panel.fields


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0040_alter_challengemodepage_feedbackmodals"),
    ]

    operations = [
        migrations.CreateModel(
            name="GraphColors",
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
                (
                    "name",
                    models.CharField(
                        help_text="text should be exactly the same as the label of the bar",
                        max_length=100,
                    ),
                ),
                ("color", wagtail_color_panel.fields.ColorField(max_length=7)),
            ],
            options={
                "verbose_name": "Graph Colors",
                "verbose_name_plural": "Graph Colors",
                "ordering": ["name"],
            },
        ),
    ]