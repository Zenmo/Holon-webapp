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
)
from holon.models import Scenario


class ScenarioSerializer(serializers.ModelSerializer):
    actors = ActorPolymorphicSerializer(many=True, read_only=True, source="actor_set")
    gridconnections = GridConnectionPolymorphicSerializer(
        many=True, read_only=True, source="gridconnection_set"
    )
    gridnodes = GridNodePolymorphicSerializer(many=True, read_only=True, source="gridnode_set")
    policies = PolicyPolymorphicSerializer(many=True, read_only=True, source="policy_set")

    class Meta:
        model = Scenario
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(ScenarioSerializer, self).to_representation(instance)

        # changes to the json after serialization can be done here
        representation["id"] = str(instance)

        return representation
