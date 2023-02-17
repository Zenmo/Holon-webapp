from rest_framework import serializers
from api.models.scenario import Scenario
from django.utils.translation import gettext_lazy as _

from holon.models.interactive_element import InteractiveElement

class InteractiveElementInput:
    def __init__(self, interactive_element: int, value: dict, created=None):
        self.interactive_element_id = interactive_element
        self.value = value


class InteractiveElementInputSerializer(serializers.Serializer):
    interactive_element = serializers.PrimaryKeyRelatedField(
        queryset=InteractiveElement.objects.all()
    )
    value = serializers.JSONField()
    
    def create(self, validated_data):
        return InteractiveElement(**validated_data)

    class Meta:
        fields = ["interactive_element"]
        depth = 1
    


class HolonRequestSerializer(serializers.Serializer):
    interactive_elements = InteractiveElementInputSerializer(many=True)

    class Meta:
        fields = ["interactive_elements"]
        
