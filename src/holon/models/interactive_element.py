from django.db import models
from django.utils.translation import gettext_lazy as _
from modelcluster.models import ClusterableModel
from modelcluster.fields import ParentalKey
from wagtail.core.models import Orderable
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from wagtail.snippets.models import register_snippet
from wagtailmodelchooser import register_model_chooser, Chooser, register_filter
from django.core.validators import MinValueValidator
from main.snippets.interactive_element_unit import InteractiveElementUnit
from django.db import models

from wagtail.admin.panels import PageChooserPanel
from holon.models.scenario import Scenario


class ChoiceType(models.TextChoices):
    CHOICE_SINGLESELECT = "single_select"
    CHOICE_MULTISELECT = "multi_select"
    CHOICE_CONTINUOUS = "continuous"


class Colors(models.TextChoices):
    COLOR_NONE = "No color"
    COLOR_RED = "Red"
    COLOR_ORANGE = "Orange"
    COLOR_GREEN = "Green"


class Levels(models.TextChoices):
    LEVEL_NATIONAL = "national"
    LEVEL_INTERMEDIATE = "intermediate"
    LEVEL_LOCAL = "local"


@register_snippet
class InteractiveElement(ClusterableModel):
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    type = models.CharField(
        max_length=19,
        choices=ChoiceType.choices,
        default=ChoiceType.CHOICE_CONTINUOUS,
    )
    level = models.CharField(
        max_length=13,
        choices=Levels.choices,
        null=True,
        blank=True,
        help_text=_("If type is 'Continuous (slider)', choose a level. Otherwise, leave it empty"),
    )
    more_information = models.CharField(max_length=100, blank=True)
    link_wiki_page = models.ForeignKey(
        "main.WikiPage",
        blank=True,
        null=True,
        related_name="+",
        on_delete=models.SET_NULL,
        help_text=_("Use this to link to an internal wiki page."),
    )

    panels = [
        FieldPanel("scenario"),
        FieldPanel("name"),
        FieldPanel("level"),
        FieldPanel("type"),
        FieldPanel(
            "more_information",
            help_text="Here you can fill in more information. This will appear as a popover next to the title.",
        ),
        PageChooserPanel("link_wiki_page"),
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
    ]

    def __str__(self):
        name = f"{self.name}|{self.type}"
        if self.type != ChoiceType.CHOICE_CONTINUOUS and self.options.count() > 0:
            name = f"{name}|{','.join(d.option for d in self.options.all())}"

        return name

    def hash(self):
        if self.type == ChoiceType.CHOICE_CONTINUOUS:
            cv = self.continuous_values.first()
            option_hashes = cv.hash() if cv else ""
        else:
            option_hashes = ",".join([option.hash() for option in self.options.all()])

        return f"[I{self.id},{self.type},{self.level},{option_hashes}]"

    class Meta:
        verbose_name = "Interactive Element"


class InteractiveElementOptions(ClusterableModel, Orderable):
    input = ParentalKey(InteractiveElement, on_delete=models.CASCADE, related_name="options")
    option = models.CharField(max_length=255, help_text=_("Fill in your option"))
    label = models.CharField(
        max_length=255,
        help_text=_("Fill in the label that the user sees in a storyline"),
        null=True,
        blank=True,
    )
    default = models.BooleanField(
        default=False, help_text=_("Should this option be default selected?")
    )
    legal_limitation = models.CharField(
        max_length=255,
        help_text=_("Fill in the status of the legal limitation"),
        null=True,
        blank=True,
    )
    level = models.CharField(
        max_length=13,
        choices=Levels.choices,
        default=Levels.LEVEL_NATIONAL,
        null=True,
        blank=True,
    )
    color = models.CharField(
        max_length=10,
        choices=Colors.choices,
        null=True,
        blank=True,
    )

    link_wiki_page = models.ForeignKey(
        "main.WikiPage",
        blank=True,
        null=True,
        related_name="+",
        on_delete=models.SET_NULL,
        help_text=_("Use this to link to an internal page."),
    )

    panels = [
        FieldPanel("option"),
        FieldPanel("label"),
        FieldPanel("default"),
        FieldPanel("legal_limitation"),
        FieldPanel("level"),
        FieldPanel("color"),
        FieldPanel("link_wiki_page"),
        InlinePanel("rules", heading="Rules", label="Rules"),
    ]

    class Meta:
        ordering = ["sort_order"]

    def __str__(self):
        if self.label:
            return self.label
        else:
            return self.option

    def hash(self):
        rule_hashes = ",".join([rule.hash() for rule in self.rules.all()])
        return f"[O{self.id},{self.option},{self.default},{self.level},{rule_hashes}]"


class InteractiveElementContinuousValues(ClusterableModel):
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
    slider_unit = models.ForeignKey(
        InteractiveElementUnit,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    discretization_steps = models.IntegerField(
        null=True,
        blank=True,
        default=5,
        help_text=_(
            "Number of steps the slider has. Leave empty or 0 to let the slider be contiuous."
        ),
    )

    panels = [
        FieldPanel("slider_value_default"),
        FieldPanel("slider_value_min"),
        FieldPanel("slider_value_max"),
        FieldPanel("discretization_steps"),
        InlinePanel("rules", heading="Rules", label="Rules"),
        FieldPanel("slider_unit"),
    ]

    def hash(self):
        rule_hashes = ",".join([rule.hash() for rule in self.rules.all()])
        return f"[CV{self.id},{self.slider_value_min},{self.slider_value_max},{self.discretization_steps},{rule_hashes}]"
