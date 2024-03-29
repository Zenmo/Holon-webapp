# Generated by Django 4.1.7 on 2023-03-15 10:09

from django.db import migrations
import main.blocks.feedbackmodals
import main.blocks.holon_image_chooser
import wagtail.blocks
import wagtail.fields


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0047_alter_challengemodepage_feedbackmodals_and_more"),
    ]

    operations = [
        migrations.AlterField(
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
                                    "modaltext",
                                    wagtail.blocks.TextBlock(
                                        help_text="Text of the modal", required=False
                                    ),
                                ),
                                (
                                    "modaltheme",
                                    wagtail.blocks.ChoiceBlock(
                                        choices=[
                                            ("green", "Green"),
                                            (
                                                "greenwithconfetti",
                                                "Green with confetti",
                                            ),
                                            ("orange", "Orange"),
                                            ("red", "Red"),
                                        ],
                                        help_text="Set the theme of this modal",
                                        max_length=30,
                                    ),
                                ),
                                (
                                    "modalshowonce",
                                    wagtail.blocks.BooleanBlock(
                                        default=True,
                                        help_text="If checked, this feedback modal will appear once",
                                        required=False,
                                    ),
                                ),
                                (
                                    "image_selector",
                                    main.blocks.holon_image_chooser.HolonImageChooserBlock(),
                                ),
                                (
                                    "conditions",
                                    wagtail.blocks.StreamBlock(
                                        [
                                            (
                                                "kpi_condition",
                                                wagtail.blocks.StructBlock(
                                                    [
                                                        (
                                                            "parameter",
                                                            wagtail.blocks.ChoiceBlock(
                                                                choices=[
                                                                    (
                                                                        "local|costs",
                                                                        "Local Costs",
                                                                    ),
                                                                    (
                                                                        "local|netload",
                                                                        "Local Netload",
                                                                    ),
                                                                    (
                                                                        "local|self_sufficiency",
                                                                        "Local Sufficiency",
                                                                    ),
                                                                    (
                                                                        "local|sustainability",
                                                                        "Local Sustainability",
                                                                    ),
                                                                    (
                                                                        "national|costs",
                                                                        "National Costs",
                                                                    ),
                                                                    (
                                                                        "national|netload",
                                                                        "National Netload",
                                                                    ),
                                                                    (
                                                                        "national|self_sufficiency",
                                                                        "National Sufficiency",
                                                                    ),
                                                                    (
                                                                        "national|sustainability",
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
                                            ),
                                            (
                                                "interactive_input_condition",
                                                wagtail.blocks.StructBlock(
                                                    [
                                                        (
                                                            "parameter",
                                                            wagtail.blocks.ChoiceBlock(
                                                                choices=main.blocks.feedbackmodals.FeedbackModalInteractiveInputCondition.get_interactive_inputs,
                                                                help_text="Please make sure the parameter is present in this section. Otherwise you assert something that doesn't exist",
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
                                            ),
                                        ],
                                        block_counts={},
                                        help_text="Feedback will only be shown when ALL conditions of a modal are true",
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
