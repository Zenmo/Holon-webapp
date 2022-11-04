""" Scenario Block """
from django.utils.translation import gettext_lazy as _

from api.models import Slider
from wagtail.core import blocks
from .holon_image_chooser import HolonImageChooserBlock

ANIMATION_1 = "animation1"
SOLAR_AND_WINDMILLS = "solar_and_windmills"
ANIMATION_3 = "animation3"
ANIMATION_CHOICES = (
    (ANIMATION_1, "Animatie 1 (Test)"),
    (SOLAR_AND_WINDMILLS, "Solarpanels and windmills"),
    (ANIMATION_1, "Animatie 3 (Test)"),
)


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


class StorylineSectionBlock(blocks.StructBlock):
    """Blocks for all the scenarios"""

    content = blocks.StreamBlock(
        [
            ("text", blocks.RichTextBlock()),
            ("slider", SliderBlock()),
            ("static_image", HolonImageChooserBlock(required=False)),
            (
                "animation",
                blocks.ChoiceBlock(
                    required=False,
                    choices=ANIMATION_CHOICES,
                    default=SOLAR_AND_WINDMILLS,
                ),
            )
            # ("radiobuttons", RadioButtonBlock()),
        ]
    )
