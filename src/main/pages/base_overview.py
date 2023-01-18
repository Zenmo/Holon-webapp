from django.utils.translation import gettext_lazy as _
from django.db import models

from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.edit_handlers import FieldPanel

from .base import BasePage


class BaseOverview(HeadlessPreviewMixin, BasePage):
    """A abstract class for the overview pages"""

    introduction = models.TextField(
        null=True, blank=True, help_text="Introduction of the overview page"
    )

    extra_panels = BasePage.extra_panels
    content_panels = BasePage.content_panels + [
        FieldPanel("introduction"),
    ]

    class Meta:
        abstract = True
