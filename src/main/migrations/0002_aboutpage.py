# Generated by Django 4.0.4 on 2022-09-28 07:28

from django.db import migrations, models
import django.db.models.deletion
import wagtail_headless_preview.models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="AboutPage",
            fields=[
                (
                    "basepage_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="main.basepage",
                    ),
                ),
                (
                    "company_name",
                    models.CharField(
                        blank=True,
                        max_length=250,
                        null=True,
                        verbose_name="Company name",
                    ),
                ),
            ],
            options={
                "verbose_name": "About",
            },
            bases=(
                wagtail_headless_preview.models.HeadlessPreviewMixin,
                "main.basepage",
            ),
        ),
    ]
