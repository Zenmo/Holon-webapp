from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory

from ..factories.base_page import BasePageFactory
from ..factories.casuspage_page import CasusPageFactory
from ..pages import CasusPageSerializer


class CasusPageTest(WagtailPageTests):
    def setUp(self):
        self.root_page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=self.root_page)

    def test_get_serializer_class(self):
        page = CasusPageFactory.create(title="CasusPage", parent=self.root_page)
        self.assertEqual(page.get_serializer_class(), CasusPageSerializer)

    def test_to_react_representation(self):
        page = CasusPageFactory.create(title="CasusPage", parent=self.root_page)

        data = page.get_component_data({})

        self.assertTrue("component_props" in data)
        self.assertTrue("title" in data["component_props"])
        self.assertEqual("CasusPage", data["component_props"]["title"])
