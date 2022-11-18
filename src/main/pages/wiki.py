from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin
from django.db import models
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel

from .base import BasePage


class WikiPage(HeadlessPreviewMixin, BasePage):
    introduction = models.CharField(
        max_length=500, help_text=_("Text used in the highlight on other pages")
    )

    rich_text = RichTextField(blank=True, null=True, verbose_name=_("Rich text"))

    content_panels = BasePage.content_panels + [FieldPanel("introduction"), FieldPanel("rich_text")]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.WikiPageSerializer"

    class Meta:
        verbose_name = _("Wiki")
