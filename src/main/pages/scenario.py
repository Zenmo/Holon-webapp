from django.db import models
from django import forms
from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.api import APIField
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel
from main.blocks import BaseStreamBlock
from .base import BasePage
from wagtail.core.fields import StreamField


class ScenarioPage(HeadlessPreviewMixin, BasePage):

    body = StreamField(BaseStreamBlock(), verbose_name="Page body", blank=True, null=True)

    scenariotitle = models.CharField(
        verbose_name="scenariotitle",
        max_length=100,
        null=True,
        blank=True,
        help_text="Scenario title",
    )

    description = RichTextField(blank=True, null=True, verbose_name=_("Rich text"))

    class RoleOptions(models.TextChoices):
        Rijk = "Rijk", "Rijk"
        Provincie = "Provincie", "Provincie"
        Gemeente = "Gemeente", "Gemeente"

    role = models.TextField(
        max_length=25,
        choices=RoleOptions.choices,
        default=RoleOptions.Rijk,
    )

    class InformationtypeOptions(models.TextChoices):
        Wiki = "Wiki", "Wiki"
        Stories = "Stories", "Stories"
        Challenges = "Challenges", "Challenges"

    informationtype = models.TextField(
        max_length=25,
        choices=InformationtypeOptions.choices,
        default=InformationtypeOptions.Wiki,
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("scenariotitle"),
        FieldPanel("description"),
        FieldPanel("role", widget=forms.Select),
        FieldPanel("informationtype", widget=forms.Select),
        FieldPanel("body"),
    ]
    api_fields = [
        APIField("scenariotitle"),
        APIField("description"),
        APIField("role"),
        APIField("informationtype"),
        APIField("body"),
    ]

    serializer_class = "main.pages.ScenarioPageSerializer"

    class Meta:
        verbose_name = _("Scenario")
