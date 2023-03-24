from .base_serializer import BasePageSerializer
from rest_framework import serializers
from main.pages.storyline import StorylinePage
from main.pages.base_storyline_challengemode import (
    StorylinePageRoleType,
    StorylinePageInformationType,
)
from main.snippets.graphcolors import GraphColors
from main.snippets.interactive_element_unit import InteractiveElementUnit


class StorylinePageRoleTypeSerializer(serializers.ModelSerializer):
    """Serializer for the StorylinePageCategory"""

    class Meta:
        model = StorylinePageRoleType
        fields = ["name", "slug"]

class StorylinePageUniSerializer(serializers.ModelSerializer):
    """Serializer for the StorylinePageCategory"""

    class Meta:
        model = InteractiveElementUnit
        fields = ["name", "unit"]


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
    graphcolors = serializers.SerializerMethodField()

    def get_scenario(self, obj):
        return obj.get_parent().specific.scenario_id

    def get_graphcolors(self, page):
        all = GraphColors.objects.all()
        return_gc = []
        for color in all:
            color_dict = {"name": color.name, "color": color.color}
            return_gc.append(color_dict)
        return return_gc

    class Meta:
        model = StorylinePage
        fields = [
            "storyline",
            "roles",
            "information_types",
            "scenario",
            "graphcolors",
        ] + BasePageSerializer.Meta.fields
