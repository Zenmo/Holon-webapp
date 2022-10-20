from .base_serializer import BasePageSerializer
from . import ScenariolistPage


class ScenariolistPageSerializer(BasePageSerializer):
    class Meta:
        model = ScenariolistPage
        fields = [
            "rich_text",
        ] + BasePageSerializer.Meta.fields
