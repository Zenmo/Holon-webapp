from .base_page import BasePageFactory
from ..pages.scenariolist import ScenariolistPage


class ScenariolistPageFactory(BasePageFactory):
    class Meta:
        model = ScenariolistPage
