""" Scenario Block """
from django.utils.translation import gettext_lazy as _

from wagtail.core import blocks
from holon.models import InteractiveElement
from holon.models.interactive_element import (
    ChoiceType,
    InteractiveElementContinuousValues,
    InteractiveElementOptions,
)
from main.blocks.rich_text_block import RichtextBlock
from .holon_image_chooser import HolonImageChooserBlock
from wagtailmodelchooser.blocks import ModelChooserBlock
from wagtailmodelchooser import register_model_chooser, Chooser
from .grid_chooser import GridChooserBlock
from .background_chooser import BackgroundChooserBlock
from .holarchyfeedbackimages import HolarchyFeedbackImage


def get_interactive_inputs():
    pass


@register_model_chooser
class InteractiveElementChooser(Chooser):
    model = InteractiveElement

    def get_queryset(self, request):
        from main.pages.casus import CasusPage
        from wagtail.models import Page

        qs = super().get_queryset(request)
        casus_id = request.META.get("HTTP_REFERER").split("/")[-2]

        if casus_id == "edit":
            page_id = request.META.get("HTTP_REFERER").split("/")[-3]
            casus_id = Page.objects.get(pk=page_id).get_parent().id

        scenario = CasusPage.objects.get(pk=casus_id).scenario

        return qs.filter(scenario=scenario)


class InteractiveInputBlock(blocks.StructBlock):
    DISPLAY_CHECKBOXRADIO = "checkbox_radio"
    DISPLAY_DROPDOWN = "dropdown"
    DISPLAY_CHOICES = [
        (DISPLAY_CHECKBOXRADIO, "Show as checkboxe(s) or radiobutton(s)"),
        (DISPLAY_DROPDOWN, "Show as dropdown"),
    ]

    interactive_input = ModelChooserBlock(InteractiveElement)
    display = blocks.ChoiceBlock(choices=DISPLAY_CHOICES, required=False)
    visible = blocks.BooleanBlock(required=False, default=True)
    locked = blocks.BooleanBlock(required=False)
    default_value = blocks.CharBlock(
        required=False, help_text="Type the default value exactly as it's shown on the website page"
    )
    target_value = blocks.CharBlock(required=False, help_text="Type a target value if this value needs to be added to this and all underlying sections.")

    def get_api_representation(self, value, context=None):
        if value:
            interactive_input = InteractiveElement.objects.get(pk=value["interactive_input"].id)
            options_arr = []
            if (
                interactive_input.type == ChoiceType.CHOICE_SINGLESELECT
                or interactive_input.type == ChoiceType.CHOICE_MULTISELECT
            ):
                options = InteractiveElementOptions.objects.filter(input_id=interactive_input.id)

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
                        "level": option.level,
                        "color": option.color,
                    }
                    if option.link_wiki_page is not None:
                        option_dict["title_wiki_page"] = option.link_wiki_page.title
                        option_dict["link_wiki_page"] = option.link_wiki_page.get_url_parts()[2]
                    options_arr.append(option_dict)

            if interactive_input.type == ChoiceType.CHOICE_CONTINUOUS:
                options = InteractiveElementContinuousValues.objects.filter(
                    input_id=interactive_input.id
                )
                for option in options:
                    option_dict = {
                        "id": int(option.id),
                        "slider_value_default": option.slider_value_default,
                        "slider_value_min": option.slider_value_min,
                        "slider_value_max": option.slider_value_max,
                        "slider_unit": option.slider_unit.symbol
                        if option.slider_unit is not None
                        else "",
                    }
                    options_arr.append(option_dict)

            interactive_input_info = {
                "id": interactive_input.id,
                "name": interactive_input.name,
                "type": interactive_input.type,
                "level": interactive_input.level,
                "more_information": interactive_input.more_information,
                "title_wiki_page": "",
                "link_wiki_page": "",
                "options": options_arr,
                "visible": value["visible"],
                "locked": value["locked"],
                "display": value["display"],
                "default_value_override": value["default_value"],
                "target_value": value["target_value"],
            }

            if interactive_input.link_wiki_page is not None:
                interactive_input_info["title_wiki_page"] = interactive_input.link_wiki_page.title
                interactive_input_info[
                    "link_wiki_page"
                ] = interactive_input.link_wiki_page.get_url_parts()[2]

            return interactive_input_info

    class Meta:
        icon = "radio-empty"


class StorylineSectionBlock(blocks.StructBlock):
    """Blocks for all the scenarios"""

    background = BackgroundChooserBlock()
    grid_layout = GridChooserBlock(required=True)

    text_label_national = blocks.CharBlock(default="Nationaal", required=True)
    text_label_intermediate = blocks.CharBlock(default="Regionaal", required=True)
    text_label_local = blocks.CharBlock(default="Lokaal", required=True)

    content = blocks.StreamBlock(
        [
            ("text", RichtextBlock()),
            ("interactive_input", InteractiveInputBlock()),
            ("static_image", HolonImageChooserBlock(required=False)),
            ("holarchy_feedback_image", HolarchyFeedbackImage()),
        ],
        block_counts={"static_image": {"max_num": 1}},
    )
