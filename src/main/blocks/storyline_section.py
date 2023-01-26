""" Scenario Block """
from django.utils.translation import gettext_lazy as _

from api.models import (
    InteractiveInput,
    InteractiveInputOptions,
    InteractiveInputContinuousValues,
)
from wagtail.core import blocks
from api.models.interactive_input import CHOICE_CONTINUOUS, CHOICE_MULTISELECT, CHOICE_SINGLESELECT
from main.blocks.rich_text_block import RichtextBlock
from .holon_image_chooser import HolonImageChooserBlock
from .grid_chooser import GridChooserBlock
from .background_chooser import BackgroundChooserBlock


def get_interactive_inputs():
    return [(ii.pk, ii.__str__) for ii in InteractiveInput.objects.all()]


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
    visible = blocks.BooleanBlock(required=False, default=True)
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
                    if bool(value["default_value"]):
                        if value["default_value"].lower() == option.option.lower():
                            option_default = True
                    else:
                        option_default = option.default
                    option_dict = {
                        "id": int(option.id),
                        "option": option.option,
                        "default": option_default,
                        "label": option.label,
                        "legal_limitation": option.legal_limitation,
                        "color": option.color,
                    }
                    if option.link_wiki_page is not None:
                        option_dict["title_wiki_page"] = option.link_wiki_page.title
                        option_dict["link_wiki_page"] = option.link_wiki_page.url_path
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
            ("static_image", HolonImageChooserBlock(required=False)),
        ],
        block_counts={"static_image": {"max_num": 1}},
    )
