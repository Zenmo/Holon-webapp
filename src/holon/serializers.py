from rest_framework import serializers
from api.models.scenario import Scenario
from api.models.slider import Slider


class SliderInputSerializer(serializers.Serializer):
    slider = serializers.PrimaryKeyRelatedField(queryset=Slider.objects.all())
    value = serializers.IntegerField()

    class Meta:
        fields = ["slider", "value"]
        depth = 1


class HolonRequestSerializer(serializers.Serializer):
    scenario = serializers.PrimaryKeyRelatedField(queryset=Scenario.objects.all())
    sliders = SliderInputSerializer(many=True)

    class Meta:
        fields = ["scenario", "sliders"]
