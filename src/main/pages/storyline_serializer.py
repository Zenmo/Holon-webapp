from .base_serializer import BasePageSerializer
from . import StorylinePage


class StorylinePageSerializer(BasePageSerializer):
    class Meta:
        model = StorylinePage
        fields = [
            "body",
        ] + BasePageSerializer.Meta.fields
