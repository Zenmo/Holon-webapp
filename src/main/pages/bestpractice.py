from django.utils.translation import gettext_lazy as _
from django.db import models

from wagtail.admin.edit_handlers import FieldPanel
from wagtail_headless_preview.models import HeadlessPreviewMixin

from .base import BasePage
from .casus import CasusPage


class BestPracticePage(HeadlessPreviewMixin, BasePage):
    linked_casusses = models.ManyToManyField(CasusPage, blank=True)

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.BestPracticePageSerializer"

    content_panels = BasePage.content_panels + [FieldPanel("linked_casusses")]

    class Meta:
        verbose_name = _("Best Practice")
        verbose_name_plural = _("Best Practices")
