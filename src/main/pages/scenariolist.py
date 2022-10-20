from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.api import APIField
from wagtail.admin.panels import FieldPanel
from main.blocks import BaseStreamBlock
from .base import BasePage
from wagtail.core.fields import StreamField


class ScenariolistPage(HeadlessPreviewMixin, BasePage):

    body = StreamField(BaseStreamBlock(), verbose_name="Page body", blank=True, null=True)

    api_fields = [APIField("body")]

    content_panels = BasePage.content_panels + [
        FieldPanel("body"),
    ]

    # serializer_class = "main.pages.ScenariolistPageSerializer"

    # class Meta:
    #     verbose_name = _("Scenariolist")

    subpage_types = ["ScenarioPage"]
