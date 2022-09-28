from .base_page import BasePageFactory
from ..pages.about import AboutPage


class AboutPageFactory(BasePageFactory):
    class Meta:
        model = AboutPage
