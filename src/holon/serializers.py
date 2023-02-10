from rest_framework import serializers
from api.models.scenario import Scenario
from django.utils.translation import gettext_lazy as _

from holon.models.interactive_element import InteractiveElement


class InteractiveElementInputSerializer(serializers.Serializer):
    interactive_element = serializers.PrimaryKeyRelatedField(
        queryset=InteractiveElement.objects.all()
    )
    value = serializers.JSONField()

    class Meta:
        fields = ["interactive_element"]
        depth = 1


class HolonRequestSerializer(serializers.Serializer):
    interactive_elements = InteractiveElementInputSerializer(many=True)

    class Meta:
        fields = ["interactive_elements"]
