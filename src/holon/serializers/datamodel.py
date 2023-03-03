from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from holon.models import (
    Actor,
    Contract,
    EnergyAsset,
    GridConnection,
    GridNode,
    Policy,
    Scenario,
)

# Remove if you don't need this anymore
# class DatamodelRequestSerializer(serializers.Serializer):
#     id = serializers.PrimaryKeyRelatedField(queryset=Actor.objects.all())

#     class Meta:
#         fields = ["id"]

#     def __init__(self, id):
#         self.id = id

#     def create(self, validated_data):
#         return DatamodelRequestSerializer(**validated_data)


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"


class ActorSerializer(serializers.ModelSerializer):
    contracts = ContractSerializer(many=True, read_only=True, source="contracts")

    class Meta:
        model = Actor
        fields = "__all__"


class EnergyAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyAsset
        fields = "__all__"


class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = "__all__"


class GridNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GridNode
        fields = "__all__"


class GridConnectionSerializer(serializers.ModelSerializer):
    energyassets = EnergyAssetSerializer(many=True, read_only=True, source="energyasset_set")

    class Meta:
        model = GridConnection
        fields = "__all__"


class ScenarioSerializer(serializers.ModelSerializer):
    actors = ActorSerializer(many=True, read_only=True, source="actor_set")
    gridconnections = GridConnectionSerializer(
        many=True, read_only=True, source="gridconnection_set"
    )
    gridnodes = GridNodeSerializer(many=True, read_only=True, source="gridnode_set")
    policies = PolicySerializer(many=True, read_only=True, source="policy_set")

    class Meta:
        model = Scenario
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(ScenarioSerializer, self).to_representation(instance)

        # changes to the json after serialization can be done here
        representation["id"] = str(instance)

        return representation
