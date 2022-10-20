from .base_page import BasePageFactory
from ..pages.scenario import ScenarioPage


class ScenarioPageFactory(BasePageFactory):
    class Meta:
        model = ScenarioPage
