from django.apps import apps
from django.core.exceptions import ValidationError
from django.db import models
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel

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
        FieldPanel("model_type"),
        FieldPanel("model_subtype"),
        InlinePanel("continuous_factors", heading="Continuous factors", label="Continuous factors"),
        InlinePanel(
            "discrete_factors_attribute",
            heading="Discrete attribute factors",
            label="Discrete attribute factors",
        ),
        InlinePanel(
            "discrete_factors_remove",
            heading="Discrete remove attribute factors",
            label="Discrete remove attribute factors",
        ),
        InlinePanel(
            "discrete_factors_add",
            heading="Discrete add attribute factors",
            label="Discrete add attribute factors",
        ),
        InlinePanel(
            "discrete_factors_set_count",
            heading="Discrete add and set count attribute factors",
            label="Discrete add and set count attribute factors",
        ),
        InlinePanel(
            "discrete_factors_balancegroup",
            heading="Discrete balance group factors",
            label="Discrete balance group factors",
        ),
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
            + list(self.discrete_factors_attribute.all())
            + list(self.discrete_factors_add.all())
            + list(self.discrete_factors_remove.all())
            + list(self.discrete_factors_set_count.all())
            + list(self.discrete_factors_balancegroup.all())
        )
