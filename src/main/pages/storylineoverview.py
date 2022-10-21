from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin

from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField
from .base import BasePage

from ..blocks import StorylineOverviewBlock


class StorylineOverviewPage(HeadlessPreviewMixin, BasePage):
    storyline = StreamField(
        [
            ("storylineoverview", StorylineOverviewBlock()),
        ],
        null=True,
        blank=True,
        use_json_field=True,
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("storyline"),
    ]

    serializer_class = "main.pages.StorylineOverviewPageSerializer"

    parent_page_types = ["main.HomePage"]
    subpage_types = [
        "main.StorylinePage",  # appname.ModelName
    ]

    class Meta:
        verbose_name = _("StorylineOverview")
