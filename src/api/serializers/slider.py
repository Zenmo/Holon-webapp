""" Serializer for the Slider """
from rest_framework import serializers

from api.models.slider import Slider


class SliderSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = Slider
        fields = ["id", "name"]
