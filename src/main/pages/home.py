from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField
from main.blocks import HomepageBlock
from wagtail.api import APIField

from .base import BasePage


class HomePage(HeadlessPreviewMixin, BasePage):

    body = StreamField(HomepageBlock(), verbose_name="Page body", blank=True, null=True)
    
    content_panels = BasePage.content_panels + [ 
        FieldPanel("body"),
    ]
    api_fields = [
        APIField("body")
    ]
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.HomePageSerializer"

    class Meta:
        verbose_name = _("Home")


