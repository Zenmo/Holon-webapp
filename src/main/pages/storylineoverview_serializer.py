from .base_serializer import BasePageSerializer
from . import StorylineOverviewPage
from rest_framework.fields import Field
from rest_framework import serializers
from main.pages.storyline import StorylinePageRoleType, StorylinePageInformationType

# class StorylinePageCategoriesSerializer(Field):
#     """A custom serializer used in Wagtails v2 API."""

#     def to_representation(self, categories):
#         # logic in here
#         return_posts = []
#         for child in categories:
#             post_dict = {
#                 "name": child.name,
#                 "slug": child.slug,
#             }
#             return_posts.append(post_dict)
#         return return_posts


class StorylineOverviewPageSerializer(BasePageSerializer):
    all_roles = serializers.SerializerMethodField()
    all_information_types = serializers.SerializerMethodField()

    def get_all_roles(self, page):
        all = StorylinePageRoleType.objects.all()
        return_all_roles = []
        for role in all:
            role_dict = {"name": role.name, "slug": role.slug}
            return_all_roles.append(role_dict)
        return return_all_roles

    def get_all_information_types(self, page):
        all = StorylinePageInformationType.objects.all()
        return_all_information_types = []
        for it in all:
            it_dict = {"name": it.name, "slug": it.slug}
            return_all_information_types.append(it_dict)
        return return_all_information_types

    class Meta:
        model = StorylineOverviewPage
        fields = [
            "all_roles",
            "all_information_types",
        ] + BasePageSerializer.Meta.fields
