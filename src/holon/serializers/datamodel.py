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

EXCLUDE_FIELDS = ["polymorphic_ctype", "payload"]


class AnyLogicModelSerializer(serializers.ModelSerializer):
    def get_fields(self, exclude_fields=None):
        # list factory outside function scope please
        if exclude_fields is None:
            exclude_fields = []

        fields = super().get_fields()

        exclude_fields += EXCLUDE_FIELDS
        for field in exclude_fields:
            # providing a default prevents a KeyError
            # if the field does not exist
            fields.pop(field, default=None)

        return fields

    def to_representation(self, instance):
        representation = super(AnyLogicModelSerializer, self).to_representation(instance)

        if representation["wildcard_JSON"] is not None:
            wildcard = representation.pop("wildcard_JSON")[0]

            for key, value in wildcard.items():
                representation[key] = value

        return representation


class ContractSerializer(AnyLogicModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    id = serializers.SerializerMethodField()

    def get_id(self, obj):
        return f"c{obj.id}"


class ActorSerializer(AnyLogicModelSerializer):
    contracts = ContractSerializer(many=True, read_only=True)

    class Meta:
        model = Actor
        fields = "__all__"

    id = serializers.SerializerMethodField()

    def get_id(self, obj):
        return f"{obj.category.lower()[:3]}{obj.id}"


class EnergyAssetSerializer(AnyLogicModelSerializer):
    class Meta:
        model = EnergyAsset
        fields = "__all__"


class PolicySerializer(AnyLogicModelSerializer):
    class Meta:
        model = Policy
        fields = "__all__"


class GridNodeSerializer(AnyLogicModelSerializer):
    class Meta:
        model = GridNode
        fields = "__all__"


class GridConnectionSerializer(AnyLogicModelSerializer):
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
