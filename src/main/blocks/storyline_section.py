""" Scenario Block """
from django.utils.translation import gettext_lazy as _
from wagtail.core import blocks

from api.models import Slider
from api.serializers import SliderSerializer


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
            # ("radiobuttons", RadioButtonBlock()),
        ]
    )
