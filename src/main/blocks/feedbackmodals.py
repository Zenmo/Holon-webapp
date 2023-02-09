from django.utils.translation import gettext_lazy as _
from django.db import models

from wagtail.fields import StreamBlock
from wagtail.core import blocks


class FeedbackModalCondition(blocks.StructBlock):
    class ParameterChoices(models.TextChoices):
        LOCALCOSTS = "localcosts", "Local Costs"
        LOCALNETLOAD = "localnetload", "Local Netload"
        LOCALSELF_SUFFICIENCY = "localself_sufficiency", "Local Sufficiency"
        LOCALSUSTAINABILITY = "localsustainability", "Local Sustainability"
        NATIONALCOSTS = "nationalcosts", "National Costs"
        NATIONALNETLOAD = "nationalnetload", "National Netload"
        NATIONALSELF_SUFFICIENCY = "nationalself_sufficiency", "National Sufficiency"
        NATIONALSUSTAINABILITY = "nationalsustainability", "National Sustainability"

    class OperatorChoices(models.TextChoices):
        BIGGER = "bigger", "Bigger"
        BIGGEREQUAL = "biggerequal", "Bigger or Equal"
        EQUAL = "equal", "Equal"
        NOTEQUAL = "notequal", "Not Equal"
        LOWER = "lower", "Lower"
        LOWEREQUAL = "lowerequal", "Lower or Equal"

    parameter = blocks.ChoiceBlock(
        max_length=100,
        choices=ParameterChoices.choices,
        default=ParameterChoices.LOCALCOSTS,
        required=True,
        help_text=_("Set the parameter of this condition"),
    )

    operator = blocks.ChoiceBlock(
        max_length=50,
        choices=OperatorChoices.choices,
        default=OperatorChoices.EQUAL,
        required=True,
        help_text=_("Set the operator of this condition"),
    )

    value = blocks.CharBlock(
        max_length=255,
        required=True,
        help_text=_("Set the value of this condition to compare to"),
    )


class FeedbackModal(blocks.StructBlock):
    modaltitle = blocks.CharBlock(
        max_length=255,
        required=False,
        help_text=_("Set the title of the feedback modal"),
    )

    conditions = StreamBlock(
        [
            ("conditions", FeedbackModalCondition()),
        ],
        block_counts={},
        use_json_field=True,
    )
