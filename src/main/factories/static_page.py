from .base_page import BasePageFactory
from ..pages.static import StaticPage


class StaticPageFactory(BasePageFactory):
    class Meta:
        model = StaticPage
