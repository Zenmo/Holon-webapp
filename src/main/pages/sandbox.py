from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin

from .base import BasePage


class SandboxPage(HeadlessPreviewMixin, BasePage):
    parent_page_types = ["main.CasusPage"]
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.SandboxPageSerializer"

    class Meta:
        verbose_name = _("Sandbox")
