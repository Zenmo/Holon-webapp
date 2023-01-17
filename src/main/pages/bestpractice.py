from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin

from .base import BasePage


class BestPracticePage(HeadlessPreviewMixin, BasePage):
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.BestPracticePageSerializer"

    class Meta:
        verbose_name = _("Best Practice")
        verbose_name_plural = _("Best Practices")
