from wagtail.blocks import PageChooserBlock as DefaultPageChooserBlock


class PageChooserBlock(DefaultPageChooserBlock):
    def get_api_representation(self, value, context=None):
        from wagtail.documents.api.v2.views import DocumentsAPIViewSet

        if value is None or not context:
            return None

        endpoint = DocumentsAPIViewSet()
        serializer_class = endpoint._get_serializer_class(
            context['router'], value.__class__, [], show_details=False
        )
        return serializer_class(value, context=context).data
