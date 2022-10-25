from .base_serializer import BasePageSerializer
from . import StorylinePage, StorylinePageCategory
from rest_framework import serializers


class StorylinePageSerializer(BasePageSerializer):
    class Meta:
        model = StorylinePage
        fields = ["storyline", "categories"] + BasePageSerializer.Meta.fields
