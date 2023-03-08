from rest_framework import serializers

from holon.models.scenario import Scenario
from holon.models.config import AnylogicCloudConfig, AnylogicCloudInput, AnylogicCloudOutput


class AnylogicCloudInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnylogicCloudInput
        fields = "__all__"


class AnylogicCloudOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnylogicCloudOutput
        fields = "__all__"


class AnylogicCloudConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnylogicCloudConfig
        fields = "__all__"

    anylogic_cloud_input = AnylogicCloudInputSerializer(many=True, read_only=True)
    anylogic_cloud_output = AnylogicCloudOutputSerializer(many=True, read_only=True)


class ScenarioAnylogicConfigSerializer(serializers.ModelSerializer):
    anylogic_config = AnylogicCloudConfigSerializer(many=True, read_only=True)

    class Meta:
        model = Scenario
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(ScenarioAnylogicConfigSerializer, self).to_representation(instance)

        # changes to the json after serialization can be done here
        representation["id"] = str(instance)

        return representation
