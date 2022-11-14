from django.utils.translation import gettext_lazy as _

from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField

from .base import BasePage


class StorylineOverviewPage(HeadlessPreviewMixin, BasePage):
    serializer_class = "main.pages.StorylineOverviewPageSerializer"

    parent_page_types = ["main.HomePage"]
    subpage_types = [
        "main.StorylinePage",  # appname.ModelName
    ]

    content_panels = BasePage.content_panels
    extra_panels = BasePage.extra_panels

    class Meta:
        verbose_name = _("StorylineOverview")
