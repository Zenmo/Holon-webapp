from django.db import models
from django.utils.translation import gettext_lazy as _
from wagtail import blocks
from wagtail.fields import StreamBlock
from wagtailmodelchooser.blocks import ModelChooserBlock

from wagtailmodelchooser import Chooser, register_model_chooser
from holon.models import DatamodelQueryRule
from holon.models.interactive_element import InteractiveElement

from .holon_image_chooser import HolonImageChooserBlock


class OperatorChoices(models.TextChoices):
    BIGGER = "bigger", "Bigger"
    BIGGEREQUAL = "biggerequal", "Bigger or Equal"
    EQUAL = "equal", "Equal"
    NOTEQUAL = "notequal", "Not Equal"
    LOWER = "lower", "Lower"
    LOWEREQUAL = "lowerequal", "Lower or Equal"


class FeedbackModalKPICondition(blocks.StructBlock):
    class ParameterChoices(models.TextChoices):
        LOCALCOSTS = "local|costs", "Local Costs"
        LOCALNETLOAD = "local|netload", "Local Netload"
        LOCALSELF_SUFFICIENCY = "local|self_sufficiency", "Local Sufficiency"
        LOCALSUSTAINABILITY = "local|sustainability", "Local Sustainability"
        NATIONALCOSTS = "national|costs", "National Costs"
        NATIONALNETLOAD = "national|netload", "National Netload"
        NATIONALSELF_SUFFICIENCY = "national|self_sufficiency", "National Sufficiency"
        NATIONALSUSTAINABILITY = "national|sustainability", "National Sustainability"

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


class FeedbackModalInteractiveInputCondition(blocks.StructBlock):
    def get_interactive_inputs():
        pass

    parameter = ModelChooserBlock(
        InteractiveElement,
        help_text=_("Choose an Interactive Element of type `Single select` or `Continuous`"),
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
        help_text=_(
            "Set the value of this condition to compare to, this is the value of the slider or the value of the radio/checkbox (field 'Option' within Interactive Element )"
        ),
    )


class FeedbackModalAnyLogicOutputCondition(blocks.StructBlock):
    anylogic_output_key = blocks.CharBlock(
        max_length=255,
        required=True,
        help_text=_("AnyLogic output key"),
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


@register_model_chooser
class DatamodelQueryRuleChooser(Chooser):
    model = DatamodelQueryRule

    def get_queryset(self, request):
        return DatamodelQueryRule.objects.filter(datamodel_conversion_step__isnull=True).filter(
            rule_action_conversion_step__isnull=True
        )


class FeedbackModalDatamodelQueryCondition(blocks.StructBlock):
    datamodel_query_rule = ModelChooserBlock(
        target_model=DatamodelQueryRule,
        required=True,
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
    class FeedbackModalThemes(models.TextChoices):
        GREEN = "green", "Green"
        GREENWITHCONFETTI = "greenwithconfetti", "Green with confetti"
        ORANGE = "orange", "Orange"
        RED = "red", "Red"

    modaltitle = blocks.CharBlock(
        max_length=255,
        required=False,
        help_text=_("Set the title of the feedback modal"),
    )
    modaltext = blocks.TextBlock(
        required=False,
        help_text=_("Text of the modal"),
    )
    modaltheme = blocks.ChoiceBlock(
        max_length=30,
        choices=FeedbackModalThemes.choices,
        default=FeedbackModalThemes.GREEN,
        required=True,
        help_text=_("Set the theme of this modal"),
    )

    modalshowonce = blocks.BooleanBlock(
        required=False, default=True, help_text="If checked, this feedback modal will appear once"
    )

    image_selector = HolonImageChooserBlock()

    conditions = StreamBlock(
        [
            ("kpi_condition", FeedbackModalKPICondition()),
            ("interactive_input_condition", FeedbackModalInteractiveInputCondition()),
            ("anylogic_output_condition", FeedbackModalAnyLogicOutputCondition()),
            ("datamodel_query_condition", FeedbackModalDatamodelQueryCondition()),
        ],
        block_counts={},
        use_json_field=True,
        help_text="Feedback will only be shown when ALL conditions of a modal are true",
    )

    class Meta:
        help_text = "Only the first modal that meets all conditions will be show. You can change the order by hovering the three dots ... "
