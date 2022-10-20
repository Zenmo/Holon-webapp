from .base_serializer import BasePageSerializer
from . import ScenarioPage


class ScenarioPageSerializer(BasePageSerializer):
    class Meta:
        model = ScenarioPage
        fields = [
            "rich_text",
        ] + BasePageSerializer.Meta.fields
