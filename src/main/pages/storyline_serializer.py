from .base_serializer import BasePageSerializer

from rest_framework import serializers
from main.pages.storyline import StorylinePage
from main.pages.base_storyline_challengemode import (
    StorylinePageRoleType,
    StorylinePageInformationType,
)

from main.snippets.graphcolors import GraphColors


class StorylinePageRoleTypeSerializer(serializers.ModelSerializer):
    """Serializer for the StorylinePageCategory"""

    class Meta:
        model = StorylinePageRoleType
        fields = ["name", "slug"]


class StorylinePageGraphColorSerializer(serializers.ModelSerializer):
    """Serializer for the StorylinePageCategory"""

    class Meta:
        model = GraphColors
        fields = ["name", "color"]


class StorylinePageInformationTypeSerializer(serializers.ModelSerializer):
    """Serializer for the StorylinePageCategory"""

    class Meta:
        model = StorylinePageInformationType
        fields = ["name", "slug", "icon"]


class StorylinePageSerializer(BasePageSerializer):
    roles = StorylinePageRoleTypeSerializer(many=True)
    information_types = StorylinePageInformationTypeSerializer(many=True)
    scenario = serializers.SerializerMethodField()

    def get_scenario(self, obj):
        return obj.get_parent().specific.scenario_id

    class Meta:
        model = StorylinePage
        fields = [
            "storyline",
            "roles",
            "information_types",
            "scenario",
        ] + BasePageSerializer.Meta.fields
