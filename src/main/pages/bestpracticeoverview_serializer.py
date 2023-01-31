from .base_serializer import BasePageSerializer
from rest_framework import serializers

from . import BestPracticeOverviewPage
from main.pages.bestpractice import BestPracticePage


class BestPracticeOverviewPageSerializer(BasePageSerializer):
    child_practices = serializers.SerializerMethodField()

    def get_child_practices(self, page):
        all_practices = BestPracticePage.objects.descendant_of(page)

        return_arr = []
        for child in all_practices:
            thumbnail = (
                {"url": child.thumbnail_rendition_url.url}
                if child.thumbnail_rendition_url is not None
                else None
            )

            child_to_append = {
                "title": child.title,
                "thumbnail": thumbnail,
                "description": child.description,
                "slug": child.slug,
                "card_color": child.card_color,
            }

            return_arr.append(child_to_append)
        return return_arr

    class Meta:
        model = BestPracticeOverviewPage
        fields = BasePageSerializer.Meta.fields + ["hero", "content", "child_practices"]
