from django.utils.translation import gettext_lazy as _
from django.db import models
from wagtail.admin.edit_handlers import FieldPanel
from django.core.validators import MinValueValidator


# Create your models here.
class Slider(models.Model):
    CHOICE_SOLAR = "solar"
    CHOICE_WINDMILLS = "windmills"

    tags = [
        (CHOICE_SOLAR, "Solarpanels"),
        (CHOICE_WINDMILLS, "Windmills"),
    ]

    name = models.CharField(max_length=100)

    slider_value_default = models.IntegerField(
        validators=[MinValueValidator(0)],
        blank=True,
        null=True,
        help_text=_("Default amount of solarpanels"),
    )
    slider_value_min = models.IntegerField(
        validators=[MinValueValidator(0)],
        blank=True,
        null=True,
        help_text=_("Minimum amount of solarpanels"),
    )
    slider_value_max = models.IntegerField(
        validators=[MinValueValidator(0)],
        blank=True,
        null=True,
        help_text=_("Maximum amount of solarpanels"),
    )

    tag = models.CharField(
        choices=tags,
        null=True,
        blank=True,
        max_length=50,
        help_text=_("Which part of the animation does this slider relate to"),
    )

    panels = [
        FieldPanel("name"),
        FieldPanel("slider_value_default"),
        FieldPanel("slider_value_min"),
        FieldPanel("slider_value_max"),
        FieldPanel("tag"),
    ]

    class Meta:
        verbose_name = "Slider"
