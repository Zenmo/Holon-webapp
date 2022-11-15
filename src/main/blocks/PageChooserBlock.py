from wagtail.blocks import PageChooserBlock as DefaultPageChooserBlock

from nextjs.api import PageRelativeUrlListAPIViewSet


class PageChooserBlock(DefaultPageChooserBlock):
    def get_api_representation(self, value, context=None):
    

        if value is None or not context:
            return None

        endpoint = PageRelativeUrlListAPIViewSet()
        print(context)
        serializer_class = endpoint._get_serializer_class(
            context['router'], value.__class__, [], show_details=True
        )
        return serializer_class(value, context=context).data

