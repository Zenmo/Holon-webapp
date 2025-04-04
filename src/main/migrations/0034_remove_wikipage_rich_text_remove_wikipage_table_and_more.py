# Generated by Django 4.1.5 on 2023-01-24 09:29

import json
from django.db import migrations
from main.blocks.paragraph import ParagraphBlock
import main.blocks.rich_text_block
import wagtail.blocks
import wagtail.contrib.table_block.blocks
import wagtail.fields
from wagtail.rich_text import RichText


def convert_to_streamfield(apps, schema_editor):
    WikiPage = apps.get_model("main", "WikiPage")
    for page in WikiPage.objects.all():
        rich_text = {"text": RichText(page.rich_text)}
        page.content = [("paragraph_block", rich_text)]
        page.save()


def convert_to_richtext(apps, schema_editor):
    WikiPage = apps.get_model("main", "WikiPage")
    for page in WikiPage.objects.all():
        if page.rich_text is None:
            rich_text = "".join(
                [
                    child.value["text"].source
                    for child in page.content
                    if child.block_type == "paragraph_block"
                ]
            )
            page.rich_text = rich_text
            page.save()


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0034_alter_wikipage_table"),
    ]

    operations = [
        migrations.AddField(
            model_name="wikipage",
            name="content",
            field=wagtail.fields.StreamField(
                [
                    (
                        "paragraph_block",
                        wagtail.blocks.StructBlock(
                            [
                                (
                                    "grid_layout",
                                    wagtail.blocks.StructBlock(
                                        [
                                            (
                                                "grid",
                                                wagtail.blocks.ChoiceBlock(
                                                    choices=[
                                                        ("33_66", "33% - 66%"),
                                                        ("50_50", "50% - 50%"),
                                                        ("66_33", "66% - 33%"),
                                                    ]
                                                ),
                                            )
                                        ],
                                        required=True,
                                    ),
                                ),
                                (
                                    "background",
                                    wagtail.blocks.StructBlock(
                                        [
                                            (
                                                "color",
                                                wagtail.blocks.ChoiceBlock(
                                                    choices=[
                                                        ("block__bg-white", "White"),
                                                        ("block__bg-gray", "Pale gray"),
                                                        (
                                                            "block__bg-purple",
                                                            "Pale purple",
                                                        ),
                                                    ]
                                                ),
                                            ),
                                            (
                                                "size",
                                                wagtail.blocks.ChoiceBlock(
                                                    choices=[
                                                        (
                                                            "bg__full",
                                                            "Full backgroundcolor",
                                                        ),
                                                        (
                                                            "bg__left",
                                                            "Only backgroundcolor in the left block",
                                                        ),
                                                    ]
                                                ),
                                            ),
                                        ]
                                    ),
                                ),
                                (
                                    "text",
                                    main.blocks.rich_text_block.RichTextBlock(
                                        help_text="Add your text",
                                        required=True,
                                        rows=15,
                                    ),
                                ),
                            ]
                        ),
                    ),
                    (
                        "table_block",
                        wagtail.contrib.table_block.blocks.TableBlock(
                            help_text="Add extra columns and rows with right mouse click",
                            required=True,
                            table_options={
                                "editor": "text",
                                "renderer": "text",
                                "startRows": 3,
                            },
                        ),
                    ),
                ],
                blank=True,
                null=True,
                use_json_field=True,
                verbose_name="Page body",
            ),
        ),
        migrations.RunPython(
            convert_to_streamfield,
            convert_to_richtext,
        ),
        migrations.RemoveField(
            model_name="wikipage",
            name="rich_text",
        ),
        migrations.RemoveField(
            model_name="wikipage",
            name="table",
        ),
    ]
