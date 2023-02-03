from .base_page import BasePageFactory
from ..pages.casusoverview import CasusOverviewPage


class CasusOverviewPageFactory(BasePageFactory):
    class Meta:
        model = CasusOverviewPage
