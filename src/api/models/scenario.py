from django.utils.translation import gettext_lazy as _
from django.db import models
from wagtail.admin.edit_handlers import FieldPanel
from django.core.validators import MinValueValidator


# TODO: CAN WE DELETE THIS?

# Create your models here.
class Scenario(models.Model):
    name = models.CharField(max_length=100)

    panels = [
        FieldPanel("name"),
    ]

    class Meta:
        verbose_name = "Scenario"

    def __str__(self):
        return self.name
