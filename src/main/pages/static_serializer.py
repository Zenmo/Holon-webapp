from .base_serializer import BasePageSerializer
from . import StaticPage


class StaticPageSerializer(BasePageSerializer):
    class Meta:
        model = StaticPage
        fields = ["content"] + BasePageSerializer.Meta.fields
