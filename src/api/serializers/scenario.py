""" Serializer for the Slider """
from rest_framework import serializers

from api.models.scenario import Scenario


class ScenarioSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = Scenario
        fields = ["id", "name"]
