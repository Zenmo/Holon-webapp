""" StorylineOverview Block """
from django.utils.translation import gettext_lazy as _
from wagtail.core import blocks


class StorylineOverviewBlock(blocks.StructBlock):
    visible = blocks.BooleanBlock(default=True)

    # def get_api_representation(self, value, context=None):
    #     if value:
    #         slide = Slider.objects.get(pk=value["slider"])
    #         return {
    #             "name": slide.name,
    #             "slider_value_default": slide.slider_value_default,
    #             "slider_value_min": slide.slider_value_min,
    #             "slider_value_max": slide.slider_value_max,
    #             "slider_locked": slide.slider_locked,
    #             "tag": slide.tag,
    #         }


# class ScenarioBlock(blocks.StructBlock):
#     """Blocks for all the scenarios"""

#     content = blocks.StreamBlock(
#         [
#             ("text", blocks.RichTextBlock()),
#             ("slider", SliderBlock()),
#             # ("radiobuttons", RadioButtonBlock()),
#         ]
#     )
