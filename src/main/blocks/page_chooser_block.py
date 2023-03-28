from wagtail.blocks import PageChooserBlock as DefaultPageChooserBlock

from nextjs.api import PageRelativeUrlListAPIViewSet


class PageChooserBlock(DefaultPageChooserBlock):
    def get_api_representation(self, value, context=None):
        if value is None or not context:
            return None

        return value.get_url()
