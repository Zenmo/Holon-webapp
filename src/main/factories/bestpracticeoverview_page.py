from .base_page import BasePageFactory
from ..pages.bestpracticeoverview import BestPracticeOverviewPage


class BestPracticeOverviewPageFactory(BasePageFactory):
    class Meta:
        model = BestPracticeOverviewPage
