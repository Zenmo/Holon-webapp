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

        # unpack wildcard json to level key:vaue pairs
        if representation["wildcard_JSON"] is not None:
            wildcard = representation.pop("wildcard_JSON")[0]

            for key, value in wildcard.items():
                representation[key] = value

        # remove if null
        else:
            _ = representation.pop("wildcard_JSON")

        return representation


class ContractSerializer(AnyLogicModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    id = serializers.SerializerMethodField()

    def get_id(self, obj):
        return f"c{obj.id}"

    def get_fields(self):
        return super().get_fields(
            exclude_fields=[
                "actor",
            ]
        )


class ActorSerializer(AnyLogicModelSerializer):
    contracts = ContractSerializer(many=True, read_only=True)

    class Meta:
        model = Actor
        fields = "__all__"

    id = serializers.SerializerMethodField()
    parent_actor = serializers.SerializerMethodField()

    def get_id(self, obj):
        return f"{obj.category.lower()[:3]}{obj.id}"

    def get_parent_actor(self, obj):
        # get related actor
        if obj.parent_actor is not None:
            obj = Actor.objects.get(id=obj.parent_actor.id)
            return self.get_id(obj)
        else:
            return obj.parent_actor


class EnergyAssetSerializer(AnyLogicModelSerializer):
    class Meta:
        model = EnergyAsset
        fields = "__all__"

    def get_fields(self):
        return super().get_fields(exclude_fields=["gridconnection", "gridnode"])


class PolicySerializer(AnyLogicModelSerializer):
    class Meta:
        model = Policy
        fields = "__all__"

    id = serializers.SerializerMethodField()

    def get_id(self, obj):
        return f"pol{obj.id}"


class GridNodeSerializer(AnyLogicModelSerializer):
    class Meta:
        model = GridNode
        fields = "__all__"

    id = serializers.SerializerMethodField()
    parent = serializers.SerializerMethodField()
    owner_actor = serializers.SerializerMethodField()

    def get_id(self, obj):
        try:
            id = f"{obj.category[0]}{obj.id}"
        except AttributeError:
            id = f"grn{obj.id}"
        return id

    def get_parent(self, obj):
        # get related gridnode
        if obj.parent is not None:
            obj = GridNode.objects.get(id=obj.parent.id)
            return self.get_id(obj)
        else:
            return obj.parent

    def get_owner_actor(self, obj):
        # get related actor
        if obj.owner_actor is not None:
            obj = Actor.objects.get(id=obj.owner_actor.id)
            return ActorSerializer().get_id(obj)
        else:
            return obj.owner_actor


class GridConnectionSerializer(AnyLogicModelSerializer):
    energyassets = EnergyAssetSerializer(many=True, read_only=True, source="energyasset_set")

    class Meta:
        model = GridConnection
        fields = "__all__"

    owner_actor = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    parent_electric = serializers.SerializerMethodField()
    parent_heat = serializers.SerializerMethodField()

    def get_owner_actor(self, obj):
        # get related actor
        if obj.owner_actor is not None:
            obj = Actor.objects.get(id=obj.owner_actor.id)
            return ActorSerializer().get_id(obj)
        else:
            return obj.owner_actor

    def get_id(self, obj):
        return f"grc{obj.id}"

    def get_parent_node(self, id):
        obj = GridNode.objects.get(id=id)
        return GridNodeSerializer().get_id(obj)

    def get_parent_heat(self, obj):
        if obj.parent_heat is not None:
            id = obj.parent_heat.id
            return self.get_parent_node(id=id)
        else:
            return obj.parent_heat

    def get_parent_electric(self, obj):
        if obj.parent_electric is not None:
            id = obj.parent_electric.id
            return self.get_parent_node(id=id)
        else:
            return obj.parent_electric


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
