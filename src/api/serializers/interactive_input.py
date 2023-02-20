""" Serializers """
from rest_framework import serializers


class InteractiveInputSerializer(serializers.Serializer):
    name = serializers.CharField()
