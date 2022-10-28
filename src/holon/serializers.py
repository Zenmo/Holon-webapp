from rest_framework import serializers
from api.models.scenario import Scenario
from api.models.slider import Slider
from django.utils.translation import gettext_lazy as _


class SliderInputSerializer(serializers.Serializer):
    slider = serializers.PrimaryKeyRelatedField(queryset=Slider.objects.all())
    value = serializers.IntegerField()

    def validate(self, data):
        slider = data["slider"]

        if data["value"] < slider.slider_value_min or data["value"] > slider.slider_value_max:
            raise serializers.ValidationError(
                {
                    "value": [
                        _("Slider value is out of range, min %(min)s max %(max)s")
                        % {"min": slider.slider_value_min, "max": slider.slider_value_max}
                    ]
                }
            )
        return data

    class Meta:
        fields = ["slider", "value"]
        depth = 1


class HolonRequestSerializer(serializers.Serializer):
    scenario = serializers.PrimaryKeyRelatedField(queryset=Scenario.objects.all())
    sliders = SliderInputSerializer(many=True)

    class Meta:
        fields = ["scenario", "sliders"]
