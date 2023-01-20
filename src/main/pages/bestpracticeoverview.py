from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.edit_handlers import FieldPanel

from .base import BasePage
from .base_overview import BaseOverview


class BestPracticeOverviewPage(BaseOverview):
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.BestPracticeOverviewPageSerializer"

    subpage_types = ["main.BestPracticePage"]

    content_panels = BasePage.content_panels

    class Meta:
        verbose_name = _("Best Practice Overview")
