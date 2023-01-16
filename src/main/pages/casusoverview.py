from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin

from .base import BasePage


class CasusOverviewPage(HeadlessPreviewMixin, BasePage):
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.CasusOverviewPageSerializer"

    class Meta:
        verbose_name = _("CasusOverview")
