from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory
from holon.models.scenario import Scenario
from main.factories.casuspage_page import CasusPageFactory

from main.pages.casus_serializer import CasusPageSerializer

from ..factories.base_page import BasePageFactory
from ..factories.storyline_page import StorylinePageFactory
from ..pages import StorylinePageSerializer


class StorylinePageTest(WagtailPageTests):
    def setUp(self):
        self.root_page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=self.root_page)

    def test_get_serializer_class(self):
        page = StorylinePageFactory.create(title="Storyline", parent=self.root_page)
        self.assertEqual(page.get_serializer_class(), StorylinePageSerializer)

    def test_to_react_representation(self):
        scenario = Scenario(name="test")
        scenario.save()
        casus = CasusPageFactory.create(
            title="Casus", scenario_id=scenario.id, parent=self.root_page
        )
        page = StorylinePageFactory.create(title="Storyline", parent=casus)

        data = page.get_component_data({})

        self.assertTrue("component_props" in data)
        self.assertTrue("title" in data["component_props"])
        self.assertEqual("Storyline", data["component_props"]["title"])
