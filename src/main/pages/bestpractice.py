from django.utils.translation import gettext_lazy as _
from django.db import models
from django import forms

from modelcluster.fields import ParentalManyToManyField

from wagtail.admin.edit_handlers import FieldPanel
from wagtail_headless_preview.models import HeadlessPreviewMixin

from .base import BasePage
from .base_card import BaseCard


class BestPracticePage(HeadlessPreviewMixin, BaseCard):
    linked_casus = ParentalManyToManyField("main.casuspage", blank=True)

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.BestPracticePageSerializer"

    parent_page_types = ["main.BestPracticeOverviewPage"]
    subpage_types = []

    content_panels = BaseCard.content_panels + [FieldPanel("linked_casus")]

    class Meta:
        verbose_name = _("Best Practice")
        verbose_name_plural = _("Best Practices")
