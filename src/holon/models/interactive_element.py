from django.db import models
from django.utils.translation import gettext_lazy as _
from modelcluster.models import ClusterableModel
from modelcluster.fields import ParentalKey
from wagtail.core.models import Orderable
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from wagtail.snippets.models import register_snippet
from wagtailmodelchooser import register_model_chooser, Chooser, register_filter
from django.core.validators import MinValueValidator

from holon.models.scenario import Scenario


class ChoiceType(models.TextChoices):
    single_select = "CHOICE_SINGLESELECT"
    multi_select = "CHOICE_MULTISELECT"
    continuous = "CHOICE_CONTINUOUS"


@register_snippet
class InteractiveElement(ClusterableModel):

    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    type = models.CharField(
        max_length=19,
        choices=ChoiceType.choices,
        default=ChoiceType.continuous,
    )

    panels = [
        FieldPanel("scenario"),
        FieldPanel("name"),
        FieldPanel("type"),
        InlinePanel(
            "options",
            heading="Options",
            label="Option",
            help_text=_(
                "Fill in the options for all the types of inputs, except the continuous input"
            ),
        ),
        InlinePanel(
            "continuous_values",
            heading="Continuous values",
            label="Continuous value",
            help_text=_("Fill in the options for the continuous input"),
            max_num=1,
        ),
        InlinePanel("rules", heading="Rules", label="Rules"),
    ]

    def __str__(self):
        return f"{self.name}|{self.scenario.id}"

    class Meta:
        verbose_name = "Interactive Element"


class InteractiveElementOptions(Orderable):
    input = ParentalKey(InteractiveElement, on_delete=models.CASCADE, related_name="options")
    option = models.CharField(max_length=255, help_text=_("Fill in your option"))
    label = models.CharField(
        max_length=255,
        help_text=_("Fill in the label that the user sees in a storyline"),
        null=True,
        blank=True,
    )
    default = models.BooleanField(
        null=True, blank=True, help_text=_("Should this option be default selected?")
    )

    def __str__(self):
        if self.label:
            return self.label
        else:
            return self.option


class InteractiveElementContinuousValues(models.Model):
    input = ParentalKey(
        InteractiveElement, on_delete=models.CASCADE, related_name="continuous_values"
    )
    slider_value_default = models.IntegerField(
        validators=[MinValueValidator(0)],
        blank=True,
        null=True,
        help_text=_("Default amount of the continuous input"),
    )
    slider_value_min = models.IntegerField(
        validators=[MinValueValidator(0)],
        blank=True,
        null=True,
        default=0,
        help_text=_("Minimum amount of the continuous input"),
    )
    slider_value_max = models.IntegerField(
        validators=[MinValueValidator(0)],
        blank=True,
        null=True,
        default=100,
        help_text=_("Maximum amount of the continuous input"),
    )
