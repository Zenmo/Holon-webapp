""" Serializer for the Slider """
from rest_framework import serializers


class SliderSerializer(serializers.Serializer):
    name = serializers.EmailField()
    slider_value_default = serializers.IntegerField()
