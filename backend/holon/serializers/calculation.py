from holon.models import Calculation
from rest_framework import serializers


class CalculationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Calculation
        fields = "__all__"
