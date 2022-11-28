""" Scenario Block """
from django.utils.translation import gettext_lazy as _

from api.models import (
    Slider,
    InteractiveInput,
    InteractiveInputOptions,
    InteractiveInputContinuousValues,
)
from wagtail.core import blocks
from wagtail.blocks.struct_block import StructBlockAdapter
from wagtail.telepath import register
from django import forms
from django.utils.functional import cached_property
from api.models.interactive_input import CHOICE_CONTINUOUS, CHOICE_MULTISELECT, CHOICE_SINGLESELECT
from main.blocks.rich_text_block import RichtextBlock
from .holon_image_chooser import HolonImageChooserBlock
from .grid_chooser import GridChooserBlock
from .background_chooser import BackgroundChooserBlock


def get_interactive_inputs():
    return [(ii.pk, ii.__str__) for ii in InteractiveInput.objects.all()]


def get_sliders():
    return [(slider.pk, slider.name) for slider in Slider.objects.all()]


class SliderBlock(blocks.StructBlock):
    slider = blocks.ChoiceBlock(choices=get_sliders)
    visible = blocks.BooleanBlock(required=False)
    locked = blocks.BooleanBlock(required=False)

    def get_api_representation(self, value, context=None):
        if value:
            slide = Slider.objects.get(pk=value["slider"])
            return {
                "id": slide.id,
                "name": slide.name,
                "slider_value_default": slide.slider_value_default,
                "slider_value_min": slide.slider_value_min,
                "slider_value_max": slide.slider_value_max,
                "tag": slide.tag,
            }

    class Meta:
        label = _("Slider (use interactive input for new sliders)")


class InteractiveInputBlock(blocks.StructBlock):
    DISPLAY_CHECKBOXRADIO = "checkbox_radio"
    DISPLAY_BUTTON = "button"
    DISPLAY_CHOICES = (
        (DISPLAY_CHECKBOXRADIO, "Show as checkboxe(s) or radiobutton(s)"),
        (DISPLAY_BUTTON, "Show as button(s)"),
    )

    interactive_input = blocks.ChoiceBlock(choices=get_interactive_inputs)
    display = blocks.ChoiceBlock(
        choices=DISPLAY_CHOICES,
        default=DISPLAY_CHECKBOXRADIO,
        help_text="Only applies if the interactive input is a Select type",
    )
    visible = blocks.BooleanBlock(required=False)
    locked = blocks.BooleanBlock(required=False)
    default_value = blocks.CharBlock(
        required=False, help_text="Type the default value exactly as it's shown on the website page"
    )

    def get_api_representation(self, value, context=None):
        if value:
            interactive_input = InteractiveInput.objects.get(pk=value["interactive_input"])
            options_arr = []
            if (
                interactive_input.type == CHOICE_SINGLESELECT
                or interactive_input.type == CHOICE_MULTISELECT
            ):
                options = InteractiveInputOptions.objects.filter(input_id=interactive_input.id)

                for option in options:
                    option_default = False
                    if value["default_value"] is not None:
                        if value["default_value"].lower() == option.option.lower():
                            option_default = True
                    option_dict = {
                        "id": int(option.id),
                        "option": option.option,
                        "default": option_default,
                    }
                    options_arr.append(option_dict)

            if interactive_input.type == CHOICE_CONTINUOUS:
                options = InteractiveInputContinuousValues.objects.filter(
                    input_id=interactive_input.id
                )
                for option in options:
                    option_dict = {
                        "id": int(option.id),
                        "slider_value_default": option.slider_value_default,
                        "slider_value_min": option.slider_value_min,
                        "slider_value_max": option.slider_value_max,
                    }
                    options_arr.append(option_dict)

            return {
                "id": interactive_input.id,
                "name": interactive_input.name,
                "type": interactive_input.type,
                "animation_tag": interactive_input.animation_tag,
                "options": options_arr,
                "display": value["display"],
                "visible": value["visible"],
                "locked": value["locked"],
                "default_value_override": value["default_value"],
            }

    class Meta:
        icon = "radio-empty"


class StorylineSectionBlock(blocks.StructBlock):
    """Blocks for all the scenarios"""

    background = BackgroundChooserBlock()
    grid_layout = GridChooserBlock(required=True)

    content = blocks.StreamBlock(
        [
            ("text", RichtextBlock()),
            ("interactive_input", InteractiveInputBlock()),
            ("slider", SliderBlock()),
            ("static_image", HolonImageChooserBlock(required=False)),
        ],
        block_counts={"static_image": {"max_num": 1}},
    )
