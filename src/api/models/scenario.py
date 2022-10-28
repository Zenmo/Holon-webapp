from django.utils.translation import gettext_lazy as _
from django.db import models
from wagtail.admin.edit_handlers import FieldPanel
from django.core.validators import MinValueValidator

from holon.models import ScenarioTag


# Create your models here.
class Scenario(models.Model):
    name = models.CharField(max_length=100)
    tag = models.ForeignKey(
        ScenarioTag,
        related_name="+",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )

    panels = [
        FieldPanel("name"),
        FieldPanel("tag"),
    ]

    class Meta:
        verbose_name = "Scenario"

    def __str__(self):
        return self.name
