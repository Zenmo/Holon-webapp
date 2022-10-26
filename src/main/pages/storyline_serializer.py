from .base_serializer import BasePageSerializer

# from . import StorylinePage
from rest_framework import serializers
from main.pages.storyline import StorylinePage, StorylinePageRoleType, StorylinePageInformationType


class StorylinePageRoleTypeSerializer(serializers.ModelSerializer):
    """Serializer for the StorylinePageCategory"""

    class Meta:
        model = StorylinePageRoleType
        fields = ["name", "slug"]


class StorylinePageInformationTypeSerializer(serializers.ModelSerializer):
    """Serializer for the StorylinePageCategory"""

    class Meta:
        model = StorylinePageInformationType
        fields = ["name", "slug"]


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
