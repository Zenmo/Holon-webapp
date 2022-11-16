from django.utils.translation import gettext_lazy as _
from django.db import models
from modelcluster.fields import ParentalKey
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from wagtail.core.models import Orderable
from modelcluster.models import ClusterableModel

# from django.core.validators import MinValueValidator
from wagtail.snippets.models import register_snippet

# Create your models here.
@register_snippet
class InteractiveInput(ClusterableModel):
    CHOICE_CHECKBOX = "checkbox"
    CHOICE_MULTIBUTTON = "multibutton"
    CHOICE_RADIOBUTTON = "radio"
    CHOICE_BUTTON = "button"
    CHOICE_CONTINUOUS = "continuous"
    TYPE_CHOICES = (
        (CHOICE_CHECKBOX, "Checkbox"),
        (CHOICE_MULTIBUTTON, "Multibutton"),
        (CHOICE_RADIOBUTTON, "Radiobutton"),
        (CHOICE_BUTTON, "Button"),
        (CHOICE_CONTINUOUS, "Continuous (slider)"),
    )

    name = models.CharField(max_length=100)
    type = models.CharField(
        max_length=12,
        choices=TYPE_CHOICES,
        default=CHOICE_CONTINUOUS,
    )

    panels = [
        FieldPanel("name"),
        FieldPanel("type"),
        InlinePanel("options", label="Options"),
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Interactive Input"


class InteractiveInputOptions(Orderable):
    page = ParentalKey(InteractiveInput, on_delete=models.CASCADE, related_name="options")
    option = models.CharField(max_length=255, help_text=_("Fill in your option"))
