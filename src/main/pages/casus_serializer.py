from .base_serializer import BasePageSerializer
from rest_framework import serializers

from . import CasusPage
from .storyline import StorylinePage
from .sandbox import SandboxPage
from .challengemode import ChallengeModePage
from itertools import chain


class CasusPageSerializer(BasePageSerializer):
    child_pages = serializers.SerializerMethodField()

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
        fields = ["content", "child_pages"] + BasePageSerializer.Meta.fields
