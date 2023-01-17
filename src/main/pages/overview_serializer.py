from rest_framework import serializers
from .base_serializer import BasePageSerializer
from . import OverviewPage
from main.pages.storyline import StorylinePage
from main.pages.challengemode import ChallengeModePage


def add_roles_and_informationtypes(page):
    roles_array = []
    for role in page.roles.all():
        role_dict = {"name": role.name}
        roles_array.append(role_dict)

    it_array = []
    for it in page.information_types.all():
        it_dict = {"name": it.name, "icon": it.icon}
        it_array.append(it_dict)

    return roles_array, it_array


class OverviewPageSerializer(BasePageSerializer):
    overview_type = serializers.CharField()
    overview_pages = serializers.SerializerMethodField()

    def get_overview_pages(self, page):
        return_arr = []

        match page.overview_type:
            case "storyline":
                overview_pages = StorylinePage.objects.all().live()
            case "challenge":
                overview_pages = ChallengeModePage.objects.all().live()

        for opage in overview_pages:
            thumbnail = (
                {"url": opage.thumbnail_rendition_url.url}
                if opage.thumbnail_rendition_url is not None
                else None
            )

            roles_and_informationtypes = add_roles_and_informationtypes(opage)
            roles = {}
            roles["roles"] = roles_and_informationtypes[0]
            roles["information_types"] = roles_and_informationtypes[1]

            return_obj = {
                "title": opage.title,
                "description": opage.description,
                "slug": opage.slug,
                "thumbnail": thumbnail,
                "card_color": opage.card_color,
            }
            return_obj.update(roles)
            return_arr.append(return_obj)

        return return_arr

    class Meta:
        model = OverviewPage
        fields = ["overview_type", "overview_pages"] + BasePageSerializer.Meta.fields
