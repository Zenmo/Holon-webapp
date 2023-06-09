from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from holon.models import (
    ActorGroup,
    ActorSubGroup,
    Actor,
    Contract,
    EnergyAsset,
    GridConnection,
    GridNode,
    Policy,
)

EXCLUDE_FIELDS = ["polymorphic_ctype", "payload"]


class AnyLogicModelSerializer(serializers.ModelSerializer):
    """base AnyLogicModelSerializer. Implements some methods that are used by subclasses.="""

    def get_fields(self, exclude_fields=None):
        """extends the get_fields method by wrapping. Pops unwanted fields after fetching"""

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
        """renames the scenario ID to the scenario name and unpacks or removes the wildcard JSON field"""
        representation = super(AnyLogicModelSerializer, self).to_representation(instance)

        # unpack wildcard json to level key:value pairs
        if representation["wildcard_JSON"] is not None:
            wildcard = representation.pop("wildcard_JSON")[0]

            for key, value in wildcard.items():
                representation[key] = value

        # remove if null
        else:
            _ = representation.pop("wildcard_JSON")

        return representation


# TODO remove after rule engine update
class ContractSerializer(AnyLogicModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    id = serializers.SerializerMethodField()
    contractScope = serializers.SerializerMethodField()

    def get_id(self, obj):
        return f"c{obj.id}"

    def get_fields(self):
        return super().get_fields(
            exclude_fields=[
                "actor",
            ]
        )

    def get_contractScope(self, obj):
        # get related actor
        if obj.contractScope is not None:
            obj = Actor.objects.get(id=obj.contractScope.id)
            return ActorSerializer().get_id(obj)
        else:
            return obj.contractScope


# TODO rename after rule engine update
class ContractV2Serializer(AnyLogicModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    id = serializers.SerializerMethodField()
    contractScope = serializers.SerializerMethodField()

    def get_id(self, obj):
        return f"c{obj.id}"

    def get_fields(self):
        return super().get_fields(
            exclude_fields=[
                "actor",
            ]
        )

    def get_contractScope(self, obj):
        return ActorSerializer().get_id(obj.contractScope)


# TODO remove after rule engine update
class ActorSerializer(AnyLogicModelSerializer):
    class Meta:
        model = Actor
        fields = "__all__"

    id = serializers.SerializerMethodField()
    group = serializers.SerializerMethodField()
    subgroup = serializers.SerializerMethodField()

    def get_id(self, obj):
        return f"{obj.category.lower()[:3]}{obj.id}"

    contracts = serializers.SerializerMethodField()

    def get_contracts(self, obj: Actor):
        from .mapper import ContractPolymorphicSerializer

        return ContractPolymorphicSerializer(obj.contracts, many=True, read_only=True).data

    def get_group(self, obj: Actor):
        if obj.group is not None:
            return ActorGroup.objects.get(id=obj.group.id).name
        else:
            return None

    def get_subgroup(self, obj: Actor):
        if obj.subgroup is not None:
            return ActorSubGroup.objects.get(id=obj.subgroup.id).name
        else:
            return None


# TODO rename after rule engine update
class ActorV2Serializer(AnyLogicModelSerializer):
    class Meta:
        model = Actor
        fields = "__all__"

    id = serializers.SerializerMethodField()
    group = serializers.SerializerMethodField()
    subgroup = serializers.SerializerMethodField()
    contracts = serializers.SerializerMethodField()

    def get_id(self, obj):
        return f"{obj.category.lower()[:3]}{obj.id}"

    def get_contracts(self, obj: Actor):
        # TODO rename after rule engine update
        from .mapper_v2 import ContractV2PolymorphicSerializer

        return ContractV2PolymorphicSerializer(obj.contract_list, many=True, read_only=True).data

    def get_group(self, obj: Actor):
        if obj.group is not None:
            return ActorGroup.objects.get(id=obj.group_id).name
        else:
            return None

    def get_subgroup(self, obj: Actor):
        if obj.subgroup is not None:
            return ActorSubGroup.objects.get(id=obj.subgroup_id).name
        else:
            return None


class EnergyAssetSerializer(AnyLogicModelSerializer):
    class Meta:
        model = EnergyAsset
        fields = "__all__"

    def get_fields(self):
        return super().get_fields(exclude_fields=["gridconnection", "gridnode"])

    category = serializers.SerializerMethodField()

    def get_category(self, obj: EnergyAsset):
        return obj.category


class PolicySerializer(AnyLogicModelSerializer):
    class Meta:
        model = Policy
        fields = "__all__"

    id = serializers.SerializerMethodField()

    def get_id(self, obj):
        return f"pol{obj.id}"


# TODO remove after rule engine update
class GridNodeSerializer(AnyLogicModelSerializer):
    class Meta:
        model = GridNode
        fields = "__all__"

    id = serializers.SerializerMethodField()
    parent = serializers.SerializerMethodField()
    owner_actor = serializers.SerializerMethodField()
    assets = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

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

    def get_assets(self, obj: GridNode):
        from .mapper import EnergyAssetPolymorphicSerializer

        return EnergyAssetPolymorphicSerializer(
            obj.energyasset_set.all(), many=True, read_only=True
        ).data

    def get_category(self, obj: GridNode):
        return obj.category


# TODO rename after rule engine update
class GridNodeV2Serializer(GridNodeSerializer):
    class Meta:
        model = GridNode
        fields = "__all__"

    id = serializers.SerializerMethodField()
    parent = serializers.SerializerMethodField()
    owner_actor = serializers.SerializerMethodField()
    assets = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    def get_id(self, obj):
        try:
            id = f"{obj.category[0]}{obj.id}"
        except AttributeError:
            id = f"grn{obj.id}"
        return id

    def get_parent(self, obj):
        # get related gridnode
        if obj.parent is not None:
            return self.get_id(obj.parent)
        else:
            return obj.parent

    def get_owner_actor(self, obj):
        # get related actor
        if obj.owner_actor is not None:
            obj = obj.owner_actor
            return ActorSerializer().get_id(obj)
        else:
            return obj.owner_actor

    def get_assets(self, obj: GridConnection):
        from .mapper import EnergyAssetPolymorphicSerializer

        return EnergyAssetPolymorphicSerializer(
            obj.energyasset_list, many=True, read_only=True
        ).data

    def get_category(self, obj: GridNode):
        return obj.category


# TODO remove after rule engine update
class GridConnectionSerializer(AnyLogicModelSerializer):
    class Meta:
        model = GridConnection
        fields = "__all__"

    owner_actor = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    parent_electric = serializers.SerializerMethodField()
    parent_heat = serializers.SerializerMethodField()
    assets = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

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

    def get_assets(self, obj: GridConnection):
        from .mapper import EnergyAssetPolymorphicSerializer

        return EnergyAssetPolymorphicSerializer(
            obj.energyasset_set.all(), many=True, read_only=True
        ).data

    def get_category(self, obj: GridConnection):
        return obj.category


# TODO rename after rule engine update
class GridConnectionV2Serializer(AnyLogicModelSerializer):
    class Meta:
        model = GridConnection
        fields = "__all__"

    owner_actor = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    parent_electric = serializers.SerializerMethodField()
    parent_heat = serializers.SerializerMethodField()
    assets = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    def get_id(self, obj):
        return f"grc{obj.id}"

    def get_owner_actor(self, obj):
        # get related actor
        if obj.owner_actor is not None:
            obj = obj.owner_actor
            return ActorSerializer().get_id(obj)
        else:
            return obj.owner_actor

    def get_parent_heat(self, obj):
        if obj.parent_heat is not None:
            return GridNodeSerializer().get_id(obj.parent_heat)
        else:
            return obj.parent_heat

    def get_parent_electric(self, obj):
        if obj.parent_electric is not None:
            return GridNodeSerializer().get_id(obj.parent_electric)
        else:
            return obj.parent_electric

    def get_assets(self, obj: GridConnection):
        from .mapper import EnergyAssetPolymorphicSerializer

        return EnergyAssetPolymorphicSerializer(
            obj.energyasset_list, many=True, read_only=True
        ).data

    def get_category(self, obj: GridConnection):
        return obj.category
