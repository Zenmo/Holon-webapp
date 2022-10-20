from .base_page import BasePageFactory
from ..pages.storylineoverview import StorylineOverviewPage


class StorylineOverviewPageFactory(BasePageFactory):
    class Meta:
        model = StorylineOverviewPage
