from rest_framework import serializers
from api.serializers.scenario import ScenarioSerializer

from api.serializers.slider import SliderSerializer


class SliderInputSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    value = serializers.IntegerField()
    fields = ["id", "value"]


class HolonRequestSerializer(serializers.Serializer):
    scenario = ScenarioSerializer()
    sliders = SliderInputSerializer(many=True)
