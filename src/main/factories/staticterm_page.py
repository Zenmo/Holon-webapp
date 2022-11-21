from .base_page import BasePageFactory
from ..pages import StaticTermPage


class StaticTermPageFactory(BasePageFactory):
    class Meta:
        model = StaticTermPage
