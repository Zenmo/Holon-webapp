""" StorylineOverview Block """
from django.utils.translation import gettext_lazy as _
from wagtail.core import blocks


class StorylineOverviewBlock(blocks.StructBlock):
    visible = blocks.BooleanBlock(default=True)
