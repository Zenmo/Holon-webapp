from .base_page import BasePageFactory
from ..pages.bestpractice import BestPracticePage


class BestPracticePageFactory(BasePageFactory):
    class Meta:
        model = BestPracticePage
