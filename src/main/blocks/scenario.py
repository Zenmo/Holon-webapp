""" Scenario Block """
from wagtail.core import blocks

from api.models import Slider


def get_sliders():
    return [(slider.pk, slider.name) for slider in Slider.objects.all()]


class SliderBlock(blocks.StructBlock):
    slider = blocks.ChoiceBlock(choices=get_sliders)
    visible = blocks.BooleanBlock(required=False)


class ScenarioBlock(blocks.StructBlock):

    scenarios = [
        ("scenario-1", "Scenario 1"),
        ("scenario-2", "Scenario 2"),
        ("scenario-3", "Scenario 3"),
    ]

    scenario = blocks.ChoiceBlock(choices=scenarios)
    content = (
        blocks.StreamBlock(
            [
                ("text", blocks.RichTextBlock()),
                ("slider", SliderBlock()),
                # ("radiobuttons", RadioButtonBlock()),
            ]
        ),
    )
