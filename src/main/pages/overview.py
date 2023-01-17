from django.utils.translation import gettext_lazy as _
from django.db import models

from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel

from .base import BasePage


TYPE_CHOICES = (
    ("storyline", "Storyline overview"),
    ("challenge", "Challenge overview"),
    ("sandbox", "Sandbox overview"),
    ("casus", "Casus overview"),
    ("bestpractice", "Best Practice overview"),
)


class OverviewPage(HeadlessPreviewMixin, BasePage):
    overview_type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        default="storyline",
        blank=False,
        help_text="Which type of overview is this page",
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("overview_type"),
    ]
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.OverviewPageSerializer"

    class Meta:
        verbose_name = _("Overview")
