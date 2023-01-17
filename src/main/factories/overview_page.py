from .base_page import BasePageFactory
from ..pages.overview import OverviewPage


class OverviewPageFactory(BasePageFactory):
    class Meta:
        model = OverviewPage
