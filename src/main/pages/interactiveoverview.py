from django.utils.translation import gettext_lazy as _
from django.db import models

from wagtail.admin.panels import FieldPanel

from .base import BasePage
from .base_overview import BaseOverview

TYPE_CHOICES = (
    ("storyline", "Storyline overview"),
    ("challenge", "Challenge overview"),
    ("sandbox", "Sandbox overview"),
)


class InteractiveOverviewPage(BaseOverview):
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
    serializer_class = "main.pages.InteractiveOverviewPageSerializer"

    subpage_types = []

    class Meta:
        verbose_name = _("Interactive Overview")
