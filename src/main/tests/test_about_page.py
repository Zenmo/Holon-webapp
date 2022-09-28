from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory

from ..factories.base_page import BasePageFactory
from ..factories.about_page import AboutPageFactory
from ..pages import AboutPageSerializer


class AboutPageTest(WagtailPageTests):
    def setUp(self):
        self.root_page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=self.root_page)

    def test_get_serializer_class(self):
        page = AboutPageFactory.create(title="About", parent=self.root_page)
        self.assertEqual(page.get_serializer_class(), AboutPageSerializer)

    def test_to_react_representation(self):
        page = AboutPageFactory.create(title="About", parent=self.root_page)

        data = page.get_component_data({})

        self.assertTrue("component_props" in data)
        self.assertTrue("title" in data["component_props"])
        self.assertEqual("About", data["component_props"]["title"])

    def test_that_company_name_are_returned(self):
        page = AboutPageFactory.create(title="About", company_name="Acme", parent=self.root_page)

        data = page.get_component_data({})
        self.assertEqual(data["component_props"]["company_name"], "Acme")
