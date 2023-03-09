from rest_framework import serializers


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
