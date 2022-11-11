from main.pages.static_serializer import StaticPageSerializer
from . import StaticTermPage


class StaticTermPageSerializer(StaticPageSerializer):
    class Meta:
        model = StaticTermPage
        fields = ["introduction"] + StaticPageSerializer.Meta.fields
