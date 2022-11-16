from .base_serializer import BasePageSerializer
from . import StorylineOverviewPage
from rest_framework.fields import Field
from rest_framework import serializers
from main.pages.storyline import StorylinePage, StorylinePageRoleType, StorylinePageInformationType


class StorylineOverviewPageSerializer(BasePageSerializer):
    all_storylines = serializers.SerializerMethodField()
    all_roles = serializers.SerializerMethodField()
    all_information_types = serializers.SerializerMethodField()

    def get_all_storylines(self, page):
        all = StorylinePage.objects.descendant_of(page)
        return_all_storylines = []
        for sl in all:
            roles_array = []
            roles = sl.roles.all()
            for role in roles:
                role_dict = {"name": role.name}
                roles_array.append(role_dict)

            it_array = []
            information_types = sl.information_types.all()
            for it in information_types:
                it_dict = {"name": it.name, "icon": it.icon}
                it_array.append(it_dict)

            sl_dict = {
                "title": sl.title,
                "description": sl.description,
                "card_color": sl.card_color,
                "slug": sl.slug,
                "roles": roles_array,
                "information_types": it_array,
                "thumbnail": {
                    "url": sl.thumbnail_rendition_url.url,
                    "width": sl.thumbnail_rendition_url.width,
                    "height": sl.thumbnail_rendition_url.height,
                },
            }

            return_all_storylines.append(sl_dict)
        return return_all_storylines

    def get_all_roles(self, page):
        all = StorylinePageRoleType.objects.all()
        return_all_roles = []
        for role in all:
            role_dict = {"name": role.name, "slug": role.slug, "icon": role.icon}
            return_all_roles.append(role_dict)
        return return_all_roles

    def get_all_information_types(self, page):
        all = StorylinePageInformationType.objects.all()
        return_all_information_types = []
        for it in all:
            it_dict = {"name": it.name, "slug": it.slug, "icon": it.icon}
            return_all_information_types.append(it_dict)
        return return_all_information_types

    class Meta:
        model = StorylineOverviewPage
        fields = [
            "all_storylines",
            "all_roles",
            "all_information_types",
            "intro",
            "footer"
        ] + BasePageSerializer.Meta.fields
