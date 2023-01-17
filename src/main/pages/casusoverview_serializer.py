from rest_framework import serializers

from .base_serializer import BasePageSerializer
from .casusoverview import CasusOverviewPage
from .casus import CasusPage
from .storyline import StorylinePage
from .challengemode import ChallengeModePage


class CasusOverviewPageSerializer(BasePageSerializer):
    all_casusses = serializers.SerializerMethodField()

    def get_all_casusses(self, page):
        casus_pages = CasusPage.objects.descendant_of(page)

        return_arr = []
        for cas in casus_pages:
            connected_to_casus_page = (
                ChallengeModePage.objects.descendant_of(cas).first()
                or StorylinePage.objects.descendant_of(cas).first()
            )
            filter = cas.casus_filter.all().first()

            cas_dict = {
                "casus_title": cas.title,
                "casus_filter": filter.name,
                "connected_casus_page": {},
            }

            if connected_to_casus_page:
                roles_array = []
                for role in connected_to_casus_page.roles.all():
                    role_dict = {"name": role.name}
                    roles_array.append(role_dict)

                it_array = []
                for it in connected_to_casus_page.information_types.all():
                    it_dict = {"name": it.name, "icon": it.icon}
                    it_array.append(it_dict)

                cas_dict["connected_casus_page"]["thumbnail"] = (
                    connected_to_casus_page.thumbnail_rendition_url.url
                    if connected_to_casus_page.thumbnail_rendition_url
                    else None
                )
                cas_dict["connected_casus_page"]["slug"] = (
                    connected_to_casus_page.slug if connected_to_casus_page.slug else None
                )
                cas_dict["connected_casus_page"]["card_color"] = (
                    connected_to_casus_page.card_color
                    if connected_to_casus_page.card_color
                    else None
                )
                cas_dict["connected_casus_page"]["title"] = (
                    connected_to_casus_page.title if connected_to_casus_page.title else None
                )
                cas_dict["connected_casus_page"]["component_name"] = (
                    connected_to_casus_page.component_name
                    if connected_to_casus_page.component_name
                    else None
                )
                cas_dict["connected_casus_page"]["component_name"] = (
                    connected_to_casus_page.component_name
                    if connected_to_casus_page.component_name
                    else None
                )
                cas_dict["connected_casus_page"]["roles"] = roles_array
                cas_dict["connected_casus_page"]["information_types"] = it_array
            return_arr.append(cas_dict)
        return return_arr

    class Meta:
        model = CasusOverviewPage
        fields = ["introduction", "all_casusses"] + BasePageSerializer.Meta.fields
