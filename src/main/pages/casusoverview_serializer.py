from rest_framework import serializers

from .base_serializer import BasePageSerializer
from . import CasusOverviewPage


class CasusOverviewPageSerializer(BasePageSerializer):
    class Meta:
        model = CasusOverviewPage
        fields = [
            "introduction",
        ] + BasePageSerializer.Meta.fields
