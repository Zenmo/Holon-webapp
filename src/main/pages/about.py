from django.db import models
from django.utils.translation import gettext_lazy as _
from wagtail.admin.panels import FieldPanel
from wagtail_headless_preview.models import HeadlessPreviewMixin

from .base import BasePage


class AboutPage(HeadlessPreviewMixin, BasePage):
    company_name = models.CharField(
        max_length=250,
        blank=True,
        null=True,
        verbose_name=_("Company name"),
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("company_name"),
    ]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.AboutPageSerializer"

    class Meta:
        verbose_name = _("About")
