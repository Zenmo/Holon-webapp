from .base_page import BasePageFactory
from ..pages.storyline import StorylinePage


class StorylinePageFactory(BasePageFactory):
    class Meta:
        model = StorylinePage
