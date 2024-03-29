# Generated by Django 4.1.6 on 2023-02-13 14:52

from django.db import migrations
import main.blocks.feedbackmodals
import main.blocks.holon_image_chooser
import wagtail.blocks
import wagtail.fields


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0039_alter_challengemodepage_feedbackmodals"),
    ]

    operations = [
        migrations.AddField(
            model_name="storylinepage",
            name="holarchyfeedbackimages",
            field=wagtail.fields.StreamField(
                [
                    (
                        "holarchyfeedbackimages",
                        wagtail.blocks.StructBlock(
                            [
                                (
                                    "image_selector",
                                    main.blocks.holon_image_chooser.HolonImageChooserBlock(),
                                ),
                                (
                                    "conditions",
                                    wagtail.blocks.StreamBlock(
                                        [
                                            (
                                                "interactive_input_condition",
                                                wagtail.blocks.StructBlock(
                                                    [
                                                        (
                                                            "parameter",
                                                            wagtail.blocks.ChoiceBlock(
                                                                choices=main.blocks.feedbackmodals.FeedbackModalInteractiveInputCondition.get_interactive_inputs
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
