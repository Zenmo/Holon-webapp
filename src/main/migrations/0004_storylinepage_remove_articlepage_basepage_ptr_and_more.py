# Generated by Django 4.1.2 on 2022-10-18 09:21

from django.db import migrations, models
import django.db.models.deletion
import main.blocks.storyline_section
import wagtail.blocks
import wagtail.embeds.blocks
import wagtail.fields
import wagtail.images.blocks
import wagtail_headless_preview.models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0003_wikipage"),
    ]

    operations = [
        migrations.CreateModel(
            name="StorylinePage",
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
                    "storyline",
                    wagtail.fields.StreamField(
                        [
                            (
                                "text_and_media",
                                wagtail.blocks.StructBlock(
                                    [
                                        (
                                            "text",
                                            wagtail.blocks.RichTextBlock(
                                                help_text="Add your text",
                                                required=True,
                                                rows=15,
                                            ),
                                        ),
                                        (
                                            "media",
                                            wagtail.blocks.StreamBlock(
                                                [
                                                    (
                                                        "image",
                                                        wagtail.images.blocks.ImageChooserBlock(
                                                            required=False
                                                        ),
                                                    ),
                                                    (
                                                        "video",
                                                        wagtail.embeds.blocks.EmbedBlock(
                                                            required=False
                                                        ),
                                                    ),
                                                ],
                                                help_text="Choose an image or paste an embed url",
                                                max_num=1,
                                            ),
                                        ),
                                        (
                                            "grid_layout",
                                            wagtail.blocks.ChoiceBlock(
                                                choices=[
                                                    ("25_75", "25% - 75%"),
                                                    ("50_50", "50% - 50%"),
                                                    ("75_25", "75% - 25%"),
                                                ]
                                            ),
                                        ),
                                    ]
                                ),
                            ),
                            (
                                "scenario",
                                wagtail.blocks.StructBlock(
                                    [
                                        (
                                            "content",
                                            wagtail.blocks.StreamBlock(
                                                [
                                                    (
                                                        "text",
                                                        wagtail.blocks.RichTextBlock(),
                                                    ),
                                                    (
                                                        "slider",
                                                        wagtail.blocks.StructBlock(
                                                            [
                                                                (
                                                                    "visible",
                                                                    wagtail.blocks.BooleanBlock(
                                                                        required=False
                                                                    ),
                                                                ),
                                                            ]
                                                        ),
                                                    ),
                                                ]
                                            ),
                                        )
                                    ]
                                ),
                            ),
                        ],
                        use_json_field=True,
                    ),
                ),
            ],
            options={
                "verbose_name": "Storyline",
            },
            bases=(
                wagtail_headless_preview.models.HeadlessPreviewMixin,
                "main.basepage",
            ),
        ),
        migrations.RemoveField(
            model_name="articlepage",
            name="basepage_ptr",
        ),
        migrations.DeleteModel(
            name="AboutPage",
        ),
        migrations.DeleteModel(
            name="ArticlePage",
        ),
    ]
