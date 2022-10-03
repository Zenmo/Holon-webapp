from .base_page import BasePageFactory
from ..pages.wiki import WikiPage


class WikiPageFactory(BasePageFactory):
    class Meta:
        model = WikiPage
