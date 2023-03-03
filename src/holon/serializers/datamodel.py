from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from holon.models import Actor, EnergyAsset, Contract, Policy, Scenario, GridConnection, GridNode


class DatamodelRequestSerializer(serializers.Serializer):
    id = serializers.PrimaryKeyRelatedField(queryset=Actor.objects.all())

    class Meta:
        fields = ["id"]

    def __init__(self, id):
        self.id = id

    def create(self, validated_data):
        return DatamodelRequestSerializer(**validated_data)


class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = "__all__"

    def create(self, validated_data):
        return Actor(**validated_data)


class EnergyAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyAsset
        fields = []

    def create(self, validated_data):
        return EnergyAsset(**validated_data)


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = []

    def create(self, validated_data):
        return Contract(**validated_data)


class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = []

    def create(self, validated_data):
        return Policy(**validated_data)


class ScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scenario
        fields = []

    def create(self, validated_data):
        return Scenario(**validated_data)


class GridConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GridConnection
        fields = []

    def create(self, validated_data):
        return GridConnection(**validated_data)


class GridNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GridNode
        fields = []

    def create(self, validated_data):
        return GridNode(**validated_data)
