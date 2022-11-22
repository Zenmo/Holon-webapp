from .base_serializer import BasePageSerializer
from . import WikiPage


class WikiPageSerializer(BasePageSerializer):
    class Meta:
        model = WikiPage
        fields = [
            "introduction",
            "rich_text",
        ] + BasePageSerializer.Meta.fields
