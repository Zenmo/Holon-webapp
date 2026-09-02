from types import SimpleNamespace
from unittest.mock import patch

from django.test import SimpleTestCase, override_settings
from wagtail.rich_text import RichText, expand_db_html, get_rewriter

from ..blocks.rich_text_block import RichTextBlock
from ..handlers import CMSDocumentLinkHandler


class RichTextBlockTest(SimpleTestCase):
    @override_settings(WAGTAILADMIN_BASE_URL="https://cms.example.test")
    def test_document_link_uses_the_configured_cms_origin(self):
        with patch.object(
            CMSDocumentLinkHandler,
            "get_instance",
            return_value=SimpleNamespace(url="/wt/documents/1/report.pdf"),
        ):
            result = CMSDocumentLinkHandler.expand_db_attributes({"id": "1"})

        self.assertEqual(result, '<a href="https://cms.example.test/wt/documents/1/report.pdf">')

    @override_settings(WAGTAILADMIN_BASE_URL="https://cms.example.test/")
    def test_absolute_document_url_is_not_prefixed(self):
        with patch.object(
            CMSDocumentLinkHandler,
            "get_instance",
            return_value=SimpleNamespace(url="https://storage.example.test/report.pdf"),
        ):
            result = CMSDocumentLinkHandler.expand_db_attributes({"id": "1"})

        self.assertEqual(result, '<a href="https://storage.example.test/report.pdf">')

    @override_settings(WAGTAILADMIN_BASE_URL="https://cms.example.test")
    def test_rich_text_block_uses_the_registered_document_handler(self):
        get_rewriter.cache_clear()
        with patch.object(
            CMSDocumentLinkHandler,
            "get_instance",
            return_value=SimpleNamespace(url="/wt/documents/1/report.pdf"),
        ):
            result = RichTextBlock().get_api_representation(
                RichText('<p><a linktype="document" id="1">Report</a></p>')
            )

        self.assertEqual(
            result,
            '<p><a href="https://cms.example.test/wt/documents/1/report.pdf">Report</a></p>',
        )

    @override_settings(WAGTAILADMIN_BASE_URL="https://cms.example.test")
    def test_non_document_relative_links_are_unchanged(self):
        result = expand_db_html('<p><a href="/frontend/page">Page</a></p>')

        self.assertEqual(result, '<p><a href="/frontend/page">Page</a></p>')
