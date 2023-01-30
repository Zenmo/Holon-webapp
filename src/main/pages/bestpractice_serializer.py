from .base_serializer import BasePageSerializer
from . import BestPracticePage
from rest_framework import serializers


class NestedBestCasusPageSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()

    def get_thumbnail(self, thumb):
        return (
            {"url": thumb.thumbnail_rendition_url.url}
            if thumb.thumbnail_rendition_url is not None
            else None
        )

    class Meta:
        model = BestPracticePage
        fields = ("id", "title", "slug", "description", "card_color", "thumbnail")


class BestPracticePageSerializer(BasePageSerializer):
    linked_casus = NestedBestCasusPageSerializer(many=True)

    class Meta:
        model = BestPracticePage
        fields = ["content", "linked_casus"] + BasePageSerializer.Meta.fields
