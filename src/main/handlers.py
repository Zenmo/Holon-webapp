from wagtail.rich_text import LinkHandler
from django.utils.html import escape
from wagtail.admin.rich_text.converters.html_to_contentstate import LinkElementHandler

from main.pages.wiki import WikiPage


class TermLinkHTMLHandler(LinkHandler):
    # Determines how a term is rendered in the api
    identifier = "term"

    @staticmethod
    def get_model():
        return WikiPage

    @classmethod
    def get_instance(cls, attrs):
        return super().get_instance(attrs).specific

    @classmethod
    def expand_db_attributes(cls, attrs):
        try:
            page = cls.get_instance(attrs)
            return '<a data-page-link="%s" data-introduction-text="%s" data-title="%s">' % (
                escape(page.localized.specific.url),
                page.introduction,
                page.title,
            )

        except WikiPage.DoesNotExist:
            return "<a>"


class TermLinkEditorHandler:
    # Determines how the HTML of a term is rendered in the richtext editor
    @staticmethod
    def get_db_attributes(tag):
        return {"id": tag["data-id"]}

    @staticmethod
    def expand_db_attributes(attrs):
        try:
            page = WikiPage.objects.get(id=attrs["id"])

            attrs = 'data-linktype="term" data-id="%d" ' % page.id
            parent_page = page.get_parent()
            if parent_page:
                attrs += 'data-parent-id="%d" ' % parent_page.id

            return '<a %shref="%s">' % (attrs, escape(page.localized.specific.url))
        except WikiPage.DoesNotExist:
            return "<a>"


class TermLinkElementHandler(LinkElementHandler):
    # Determines how the page is extracted from the database
    def get_attribute_data(self, attrs):
        try:
            page = WikiPage.objects.get(id=attrs["id"]).specific
        except WikiPage.DoesNotExist:
            # retain ID so that it's still identified as a page link (albeit a broken one)
            return {"id": int(attrs["id"]), "url": None, "parentId": None}

        parent_page = page.get_parent()

        return {
            "id": page.id,
            "url": page.url,
            "introduction": page.introduction,
            "parentId": parent_page.id if parent_page else None,
        }
