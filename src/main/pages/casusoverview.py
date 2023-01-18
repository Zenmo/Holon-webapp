from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.edit_handlers import FieldPanel

from .base import BasePage
from .base_overview import BaseOverview


class CasusOverviewPage(BaseOverview):
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.CasusOverviewPageSerializer"

    content_panels = BasePage.content_panels + [FieldPanel("introduction")]

    subpage_types = ["main.CasusPage"]

    class Meta:
        verbose_name = _("CasusOverview")
