from rest_framework import serializers
from .base_serializer import BasePageSerializer
from . import OverviewPage
from main.pages.storyline import StorylinePage
from main.pages.challengemode import ChallengeModePage
from main.pages.casus import CasusPage
from main.pages.bestpractice import BestPracticePage


def add_roles_and_informationtypes(page):
    roles_array = []
    if hasattr(page, "roles"):
        for role in page.roles.all():
            role_dict = {"name": role.name}
            roles_array.append(role_dict)

    it_array = []
    if hasattr(page, "information_types"):
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
            case "casus":
                overview_pages = CasusPage.objects.all().live()
            case "bestpractice":
                overview_pages = BestPracticePage.objects.all().live()

        for opage in overview_pages:
            fields = ["title", "description", "slug", "card_color"]
            return_obj = {}

            for field in fields:
                if hasattr(opage, field):
                    return_obj[field] = getattr(opage, field)

            return_obj["thumbnail"] = None
            if (
                hasattr(opage, "thumbnail_rendition_url")
                and getattr(opage, "thumbnail_rendition_url") is not None
            ):
                return_obj["thumbnail"] = {"url": opage.thumbnail_rendition_url.url}

            roles_and_informationtypes = add_roles_and_informationtypes(opage)
            if hasattr(opage, "roles"):
                return_obj["roles"] = roles_and_informationtypes[0]
            if hasattr(opage, "information_types"):
                return_obj["information_types"] = roles_and_informationtypes[1]

            return_arr.append(return_obj)

        return return_arr

    class Meta:
        model = OverviewPage
        fields = ["overview_type", "overview_pages"] + BasePageSerializer.Meta.fields
