from main.pages.bestpractice import BestPracticePage
from .base_serializer import BasePageSerializer
from rest_framework import serializers

from . import CasusPage
from .storyline import StorylinePage
from .sandbox import SandboxPage
from .challengemode import ChallengeModePage
from itertools import chain


class NestedBestPracticePageSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()

    def get_thumbnail(self, thumb):
        return (
            {"url": thumb.thumbnail_rendition_url.url}
            if thumb.thumbnail_rendition_url is not None
            else None
        )

    class Meta:
        model = BestPracticePage
        fields = ("id", "title", "slug", "description", "card_color", "thumbnail", "url")


class CasusPageSerializer(BasePageSerializer):
    child_pages = serializers.SerializerMethodField()
    linked_best_practices = NestedBestPracticePageSerializer(many=True)

    def get_child_pages(self, page):
        all_story = StorylinePage.objects.descendant_of(page)
        all_challenge = ChallengeModePage.objects.descendant_of(page)
        all_sandbox = SandboxPage.objects.descendant_of(page)
        all_childs = sorted(
            chain(all_story, all_challenge, all_sandbox), key=lambda instance: instance.id
        )

        return_arr = []
        for child in all_childs:
            child_to_append = {
                "title": child.title,
                "component_name": child.component_name,
                "slug": child.slug,
            }
            return_arr.append(child_to_append)

        return return_arr

    class Meta:
        model = CasusPage
        fields = [
            "content",
            "child_pages",
            "linked_best_practices",
        ] + BasePageSerializer.Meta.fields
