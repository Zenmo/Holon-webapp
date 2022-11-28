from rest_framework import serializers
from api.models.interactive_input import InteractiveInput
from api.models.scenario import Scenario
from api.models.slider import Slider
from django.utils.translation import gettext_lazy as _


class InteractiveElementInputSerializer(serializers.Serializer):
    interactive_element = serializers.PrimaryKeyRelatedField(
        queryset=InteractiveInput.objects.all()
    )
    value = serializers.JSONField()

    class Meta:
        fields = ["interactive_element"]
        depth = 1


class HolonRequestSerializer(serializers.Serializer):
    interactive_elements = InteractiveElementInputSerializer(many=True)

    class Meta:
        fields = ["interactive_elements"]
