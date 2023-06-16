"""
Should import from mappers

## Mappers should
    1. Implement many relation at gridconnections and actors
"""

from rest_framework import serializers
from .mapper import (
    ActorPolymorphicSerializer,
    GridConnectionPolymorphicSerializer,
    GridNodePolymorphicSerializer,
    PolicyPolymorphicSerializer,
    PolicyPolymorphicSerializer,
)
from holon.models import Scenario


class ScenarioSerializer(serializers.ModelSerializer):
    actors = ActorPolymorphicSerializer(many=True, read_only=True)
    gridconnections = GridConnectionPolymorphicSerializer(many=True, read_only=True)
    gridnodes = GridNodePolymorphicSerializer(many=True, read_only=True)
    policies = PolicyPolymorphicSerializer(many=True, read_only=True)

    class Meta:
        model = Scenario
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(ScenarioSerializer, self).to_representation(instance)

        # changes to the json after serialization can be done here
        representation["id"] = str(instance)

        return representation
