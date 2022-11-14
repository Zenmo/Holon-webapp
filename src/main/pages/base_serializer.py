import re
from typing import List

from rest_framework import serializers
from wagtail.admin.templatetags.wagtailuserbar import wagtailuserbar
from wagtail import fields
from wagtail.api.v2 import serializers as wagtail_serializers

from sitesettings.models import SiteSetting
from sitesettings.serializers import SiteSettingSerializer
from ..serializers import SeoSerializer
from . import BasePage


class BasePageSerializer(serializers.ModelSerializer):
    serializer_field_mapping = serializers.ModelSerializer.serializer_field_mapping.copy()
    serializer_field_mapping.update({fields.StreamField: wagtail_serializers.StreamField})

    seo = serializers.SerializerMethodField()
    site_setting = serializers.SerializerMethodField()
    wagtail_userbar = serializers.SerializerMethodField()
    navigation = serializers.SerializerMethodField()

    class Meta:
        model = BasePage
        fields: List[str] = [
            "id",
            "title",
            "last_published_at",
            "seo_title",
            "search_description",
            "seo",
            "site_setting",
            "wagtail_userbar",
            "show_in_menus",
            "navigation",
        ]

    def get_seo(self, page):
        return SeoSerializer(page).data

    def get_site_setting(self, page):
        site_setting = SiteSetting.for_site(page.get_site())
        return SiteSettingSerializer(site_setting).data

    # In table wagtailcore_page you can see more fields to add.
    # We can add url-path later, when we creating a submenu
    def get_navigation(self, page):
        """Creates a navigation array"""
        pages = BasePage.objects.filter(show_in_menus=True)
        return_nav = []
        for page in pages:
            if page.depth == 3:
                nav_dict = {"title": page.title, "slug": page.slug}
                return_nav.append(nav_dict)
        return return_nav

    def get_wagtail_userbar(self, page):
        request = self.context.get("request", None)
        if not request:
            return None

        if not hasattr(request, "user"):
            return None

        html = wagtailuserbar({"request": request, "self": page})
        html = re.sub(r"<script.+?</script>", "", html, flags=re.DOTALL)

        if not html:
            return None

        return {
            "html": html,
        }
