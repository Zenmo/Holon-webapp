from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from holon.models.interactive_element import InteractiveElement
from holon.models.scenario import Scenario


class InteractiveElementInput:
    def __init__(self, interactive_element: InteractiveElement, value: str):
        self.interactive_element = interactive_element
        self.value = value


class InteractiveElementInputSerializer(serializers.Serializer):
    interactive_element = serializers.PrimaryKeyRelatedField(
        queryset=InteractiveElement.objects.all()
    )
    value = serializers.CharField(max_length=255)

    def create(self, validated_data):
        return InteractiveElementInput(**validated_data)

    class Meta:
        fields = ["interactive_element"]
        depth = 1


class HolonRequestSerializer(serializers.Serializer):
    interactive_elements = InteractiveElementInputSerializer(many=True)

    scenario = serializers.PrimaryKeyRelatedField(queryset=Scenario.objects.all())

    class Meta:
        fields = ["interactive_elements"]
