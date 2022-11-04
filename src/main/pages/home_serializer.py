from .base_serializer import BasePageSerializer

from . import HomePage


class HomePageSerializer(BasePageSerializer):
    class Meta:
        model = HomePage
        fields = ["content"] + BasePageSerializer.Meta.fields
