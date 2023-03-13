from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory
from holon.models.scenario import Scenario

from main.factories.casuspage_page import CasusPageFactory

from ..factories.base_page import BasePageFactory
from ..factories.challengemode_page import ChallengeModePageFactory
from ..pages import ChallengeModePageSerializer


class ChallengeModePageTest(WagtailPageTests):
    def setUp(self):
        self.root_page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=self.root_page)

    def test_get_serializer_class(self):
        page = ChallengeModePageFactory.create(title="ChallengeMode", parent=self.root_page)
        self.assertEqual(page.get_serializer_class(), ChallengeModePageSerializer)

    def test_to_react_representation(self):
        scenario = Scenario(name="test")
        scenario.save()
        casus = CasusPageFactory.create(
            title="Casus", scenario_id=scenario.id, parent=self.root_page
        )
        page = ChallengeModePageFactory.create(title="ChallengeMode", parent=casus)

        data = page.get_component_data({})

        self.assertTrue("component_props" in data)
        self.assertTrue("title" in data["component_props"])
        self.assertEqual("ChallengeMode", data["component_props"]["title"])
