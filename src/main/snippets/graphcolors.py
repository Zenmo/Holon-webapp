from django.utils.translation import gettext_lazy as _
from django.db import models

from wagtail.snippets.models import register_snippet
from wagtail.admin.panels import FieldPanel
from wagtail_color_panel.fields import ColorField
from wagtail_color_panel.edit_handlers import NativeColorPanel

from .snippet_base import SnippetBase


@register_snippet
class GraphColors(SnippetBase):
    name = models.CharField(
        max_length=100, help_text="text should be exactly the same as the label of the bar"
    )
    color = ColorField()

    panels = [FieldPanel("name"), NativeColorPanel("color")]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Graph Colors")
        verbose_name_plural = _("Graph Colors")
        ordering = ["name"]
