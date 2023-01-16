from django.utils.translation import gettext_lazy as _
from django.db import models
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.edit_handlers import FieldPanel
from wagtail.snippets.models import register_snippet

from modelcluster.fields import ParentalManyToManyField

from .base import BasePage
from .base_storyline_challengemode import StorylinePageFilter


@register_snippet
class CasusFilter(StorylinePageFilter):
    panels = [
        FieldPanel("name"),
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("CasusFilter")
        verbose_name_plural = _("CasusFilters")
        ordering = ["name"]


class CasusPage(HeadlessPreviewMixin, BasePage):
    casus_filter = ParentalManyToManyField(CasusFilter)

    parent_page_types = ["main.CasusOverviewPage"]
    subpage_types = [
        "main.StorylinePage",
        "main.ChallengeModePage",
    ]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.CasusPageSerializer"

    content_panels = BasePage.content_panels + [FieldPanel("casus_filter")]

    class Meta:
        verbose_name = _("CasusPage")
