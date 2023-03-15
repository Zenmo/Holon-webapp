from django.apps import apps
from django.core.exceptions import ValidationError
from django.db import models
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel, MultiFieldPanel

from holon.models.interactive_element import (
    InteractiveElementOptions,
    InteractiveElementContinuousValues,
)
from holon.models.util import all_subclasses


class ModelType(models.TextChoices):
    """Types of models"""

    ACTOR = "Actor"
    ENERGYASSET = "EnergyAsset"
    GRIDNODE = "GridNode"
    GRIDCONNECTION = "GridConnection"
    POLICY = "Policy"


class ScenarioRule(ClusterableModel):
    """A rule that finds a selection of objects and updates an attribute according to user input"""

    interactive_element_option = ParentalKey(
        InteractiveElementOptions, on_delete=models.CASCADE, related_name="rules", null=True
    )
    interactive_element_continuous_values = ParentalKey(
        InteractiveElementContinuousValues,
        on_delete=models.CASCADE,
        related_name="rules",
        null=True,
    )
    model_type = models.CharField(
        max_length=255, choices=ModelType.choices
    )  # bijv gridconnection of asset
    model_subtype = models.CharField(
        max_length=255, null=True, blank=True
    )  # bijv industry terrain of photovoltaic

    panels = [
        MultiFieldPanel(
            heading="Model type and subtype",
            children=[
                FieldPanel("model_type"),
                FieldPanel("model_subtype"),
            ],
        ),
        MultiFieldPanel(
            heading="Filters",
            children=[
                InlinePanel(
                    "attribute_filters",
                    heading="Continuous attribute filters",
                    label="Continuous attribute filters",
                ),
                InlinePanel(
                    "discrete_attribute_filters",
                    heading="Discrete attribute filters",
                    label="Discrete attribute filters",
                ),
                InlinePanel(
                    "relation_attribute_filters",
                    heading="Relation attribute filters",
                    label="Relation attribute filters",
                ),
            ],
        ),
        MultiFieldPanel(
            heading="Rule actions",
            children=[
                InlinePanel(
                    "continuous_factors",
                    heading="Continuous rule actions - factors",
                    label="Continuous rule action - factor",
                ),
                InlinePanel(
                    "discrete_factors_change_attribute",
                    heading="Discrete rule actions - change attribute",
                    label="Discrete rule action - change attribute",
                ),
                InlinePanel(
                    "discrete_factors_remove",
                    heading="Discrete rule actions - remove filtered objects",
                    label="Discrete rule action - remove filtered objects",
                ),
                InlinePanel(
                    "discrete_factors_add",
                    heading="Discrete rule actions - add child models",
                    label="Discrete rule action - add child models (Select only one of the three options per model to add)",
                ),
                InlinePanel(
                    "discrete_factors_set_count",
                    heading="Discrete rule actions - set model count",
                    label="Discrete rule action - set model count",
                ),
                InlinePanel(
                    "discrete_factors_balancegroup",
                    heading="Discrete rule actions - balance child models",
                    label="Discrete rule action - balance child models",
                ),
            ],
        ),
    ]

    class Meta:
        verbose_name = "ScenarioRule"

    def clean(self):
        super().clean()

        if (
            self.model_subtype is not None
            and self.model_subtype != ""
            and self.model_subtype not in self.model_subtype_options()
        ):
            raise ValidationError("Invalid value model_subtype")

    def model_subtype_options(self):
        model_type_class = apps.get_model("holon", self.model_type)
        return [subclass.__name__ for subclass in all_subclasses(model_type_class)]

    def get_filters(self):
        return (
            list(self.attribute_filters.all())
            + list(self.relation_attribute_filters.all())
            + list(self.discrete_attribute_filters.all())
        )

    def get_actions(self):
        return (
            list(self.continuous_factors.all())
            + list(self.discrete_factors_change_attribute.all())
            + list(self.discrete_factors_add.all())
            + list(self.discrete_factors_remove.all())
            + list(self.discrete_factors_set_count.all())
            + list(self.discrete_factors_balancegroup.all())
        )
