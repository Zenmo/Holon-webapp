from .base_serializer import BasePageSerializer
from . import BestPracticePage
from rest_framework import serializers


class NestedBestCasusPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BestPracticePage
        fields = ("id", "title", "slug")


class BestPracticePageSerializer(BasePageSerializer):
    linked_casus = NestedBestCasusPageSerializer(many=True)

    class Meta:
        model = BestPracticePage
        fields = ["linked_casus"] + BasePageSerializer.Meta.fields
