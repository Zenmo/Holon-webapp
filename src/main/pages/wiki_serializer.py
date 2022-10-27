from .base_serializer import BasePageSerializer
from . import WikiPage


class WikiPageSerializer(BasePageSerializer):
    class Meta:
        model = WikiPage
        fields = [
            "rich_text",
        ] + BasePageSerializer.Meta.fields
