from .base_serializer import BasePageSerializer

from rest_framework import serializers
from main.pages.storyline import StorylinePage
from main.pages.base_storyline_challengemode import (
    StorylinePageRoleType,
    StorylinePageInformationType,
)


class StorylinePageRoleTypeSerializer(serializers.ModelSerializer):
    """Serializer for the StorylinePageCategory"""

    class Meta:
        model = StorylinePageRoleType
        fields = ["name", "slug"]


class StorylinePageInformationTypeSerializer(serializers.ModelSerializer):
    """Serializer for the StorylinePageCategory"""

    class Meta:
        model = StorylinePageInformationType
        fields = ["name", "slug", "icon"]


class StorylinePageSerializer(BasePageSerializer):
    roles = StorylinePageRoleTypeSerializer(many=True)
    information_types = StorylinePageInformationTypeSerializer(many=True)

    class Meta:
        model = StorylinePage
        fields = [
            "storyline",
            "roles",
            "information_types",
        ] + BasePageSerializer.Meta.fields
