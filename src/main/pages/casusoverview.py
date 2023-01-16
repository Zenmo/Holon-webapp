from django.utils.translation import gettext_lazy as _
from django.db import models
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel

from .base import BasePage


class CasusOverviewPage(HeadlessPreviewMixin, BasePage):
    introduction = models.TextField(null=True, blank=True)

    content_panels = BasePage.content_panels + [FieldPanel("introduction")]
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.CasusOverviewPageSerializer"

    subpage_types = ["main.CasusPage"]

    class Meta:
        verbose_name = _("CasusOverview")
