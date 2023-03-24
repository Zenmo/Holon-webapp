from django.db import models
from django.utils.translation import gettext_lazy as _


from wagtail.snippets.models import register_snippet
from wagtail.admin.edit_handlers import FieldPanel

from .snippet_base import SnippetBase


@register_snippet
class InteractiveElementUnit(SnippetBase):
    name = models.CharField(
        max_length=50
    )
    symbol = models.CharField( max_length=10)

    panels = [
        FieldPanel("name"),
        FieldPanel("symbol"),
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Unit")
        verbose_name_plural = _("Units")
        ordering = ["name"]
