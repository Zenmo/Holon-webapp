from .base_serializer import BasePageSerializer
from . import StorylinePage


class StorylinePageSerializer(BasePageSerializer):
    description = "test"

    class Meta:
        model = StorylinePage
        fields = ["storyline"] + BasePageSerializer.Meta.fields
