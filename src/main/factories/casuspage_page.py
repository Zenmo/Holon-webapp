from .base_page import BasePageFactory
from ..pages.casus import CasusPage


class CasusPageFactory(BasePageFactory):
    class Meta:
        model = CasusPage
