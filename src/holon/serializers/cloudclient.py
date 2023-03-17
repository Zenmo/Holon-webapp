from rest_framework import serializers

from holon.models import Scenario


class CloudclientRequestSerializer(serializers.Serializer):
    scenario = serializers.PrimaryKeyRelatedField(queryset=Scenario.objects.all())

    def __init__(self, obj):
        return super().__init__()
