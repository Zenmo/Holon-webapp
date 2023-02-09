from .base_page import BasePageFactory
from ..pages.interactiveoverview import InteractiveOverviewPage


class InteractiveOverviewPageFactory(BasePageFactory):
    class Meta:
        model = InteractiveOverviewPage
