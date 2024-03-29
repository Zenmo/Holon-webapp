# Generated by Django 4.1.6 on 2023-02-08 13:52

from django.db import migrations
import wagtail.blocks
import wagtail.contrib.table_block.blocks
import wagtail.fields


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0034_alter_wikipage_table"),
    ]

    operations = [
        migrations.AddField(
            model_name="challengemodepage",
            name="feedbackmodals",
            field=wagtail.fields.StreamField(
                [
                    (
                        "feedbackmodals",
                        wagtail.blocks.StructBlock(
                            [
                                (
                                    "modaltitle",
                                    wagtail.blocks.CharBlock(
                                        help_text="Set the title of the feedback modal",
                                        max_length=255,
                                        required=False,
                                    ),
                                ),
                                (
                                    "conditions",
                                    wagtail.blocks.StreamBlock(
                                        [
                                            (
                                                "conditions",
                                                wagtail.blocks.StructBlock(
                                                    [
                                                        (
                                                            "parameter",
                                                            wagtail.blocks.ChoiceBlock(
                                                                choices=[
                                                                    (
                                                                        "localcosts",
                                                                        "Local Costs",
                                                                    ),
                                                                    (
                                                                        "localnetload",
                                                                        "Local Netload",
                                                                    ),
                                                                    (
                                                                        "localself_sufficiency",
                                                                        "Local Sufficiency",
                                                                    ),
                                                                    (
                                                                        "localsustainability",
                                                                        "Local Sustainability",
                                                                    ),
                                                                    (
                                                                        "nationalcosts",
                                                                        "National Costs",
                                                                    ),
                                                                    (
                                                                        "nationalnetload",
                                                                        "National Netload",
                                                                    ),
                                                                    (
                                                                        "nationalself_sufficiency",
                                                                        "National Sufficiency",
                                                                    ),
                                                                    (
                                                                        "nationalsustainability",
                                                                        "National Sustainability",
                                                                    ),
                                                                ],
                                                                help_text="Set the parameter of this condition",
                                                                max_length=100,
                                                            ),
                                                        ),
                                                        (
                                                            "operator",
                                                            wagtail.blocks.ChoiceBlock(
                                                                choices=[
                                                                    (
                                                                        "bigger",
                                                                        "Bigger",
                                                                    ),
                                                                    (
                                                                        "biggerequal",
                                                                        "Bigger or Equal",
                                                                    ),
                                                                    ("equal", "Equal"),
                                                                    (
                                                                        "notequal",
                                                                        "Not Equal",
                                                                    ),
                                                                    ("lower", "Lower"),
                                                                    (
                                                                        "lowerequal",
                                                                        "Lower or Equal",
                                                                    ),
                                                                ],
                                                                help_text="Set the operator of this condition",
                                                                max_length=50,
                                                            ),
                                                        ),
                                                        (
                                                            "value",
                                                            wagtail.blocks.CharBlock(
                                                                help_text="Set the value of this condition to compare to",
                                                                max_length=255,
                                                                required=True,
                                                            ),
                                                        ),
                                                    ]
                                                ),
                                            )
                                        ],
                                        block_counts={},
                                        use_json_field=True,
                                    ),
                                ),
                            ]
                        ),
                    )
                ],
                blank=True,
                null=True,
                use_json_field=True,
            ),
        ),
    ]
