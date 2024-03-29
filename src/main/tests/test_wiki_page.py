from wagtail.test.utils import WagtailPageTests
from wagtail_factories import SiteFactory

from ..factories.base_page import BasePageFactory
from ..factories.wiki_page import WikiPageFactory
from ..pages import WikiPageSerializer


class WikiPageTest(WagtailPageTests):
    def setUp(self):
        self.root_page = BasePageFactory.create(title="Start", parent=None)
        SiteFactory.create(root_page=self.root_page)

    def test_get_serializer_class(self):
        page = WikiPageFactory.create(
            title="Wiki", introduction="Introduction", parent=self.root_page
        )
        self.assertEqual(page.get_serializer_class(), WikiPageSerializer)

    def test_to_react_representation(self):
        page = WikiPageFactory.create(
            title="Wiki", introduction="Introduction", parent=self.root_page
        )

        data = page.get_component_data({})

        self.assertTrue("component_props" in data)
        self.assertTrue("title" in data["component_props"])
        self.assertEqual("Wiki", data["component_props"]["title"])

    def test_that_rich_text_is_retuned(self):
        page = WikiPageFactory.create(
            title="Wikipage",
            introduction="Introduction",
            parent=self.root_page,
        )

        data = page.get_component_data({})
        self.assertEqual(data["component_props"]["introduction"], "Introduction")
