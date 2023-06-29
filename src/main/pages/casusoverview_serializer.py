from .base_serializer import BasePageSerializer
from rest_framework import serializers

from . import CasusOverviewPage
from .casus import CasusPage
from .storyline import StorylinePage
from .challengemode import ChallengeModePage
from .sandbox import SandboxPage


class CasusOverviewPageSerializer(BasePageSerializer):
    child_casusses = serializers.SerializerMethodField()

    def get_child_casusses(self, page):
        all_casusses = CasusPage.objects.descendant_of(page)

        return_arr = []
        for casus in all_casusses:
            thumbnail = (
                {"url": casus.thumbnail_rendition_url.url}
                if casus.thumbnail_rendition_url is not None
                else None
            )

            casus_to_append = {
                "title": casus.title,
                "thumbnail": thumbnail,
                "description": casus.description,
                "slug": casus.slug,
                "card_color": casus.card_color,
                "connected_casus_content": {},
            }

            connected_casus_content = (
                StorylinePage.objects.descendant_of(casus).first()
                or ChallengeModePage.objects.descendant_of(casus).first()
                or SandboxPage.objects.descendant_of(casus).first()
            )

            if connected_casus_content:
                thumbnail = (
                    {"url": connected_casus_content.thumbnail_rendition_url.url}
                    if connected_casus_content.thumbnail_rendition_url is not None
                    else None
                )

                casus_to_append["connected_casus_content"]["title"] = connected_casus_content.title
                casus_to_append["connected_casus_content"][
                    "description"
                ] = connected_casus_content.description
                casus_to_append["connected_casus_content"]["slug"] = (
                    casus.slug + "/" + connected_casus_content.slug
                )
                casus_to_append["connected_casus_content"][
                    "card_color"
                ] = connected_casus_content.card_color
                casus_to_append["connected_casus_content"]["thumbnail"] = thumbnail

            return_arr.append(casus_to_append)
        return return_arr

    class Meta:
        model = CasusOverviewPage
        fields = [
            "hero",
            "content",
            "child_casusses",
        ] + BasePageSerializer.Meta.fields
