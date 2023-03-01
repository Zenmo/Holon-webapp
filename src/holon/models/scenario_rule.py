from django.apps import apps
from django.core.exceptions import ValidationError
from django.db import models

from holon.models.interactive_element import InteractiveElement
from holon.models.scenario import Scenario
from holon.models.util import all_subclasses


class ModelType(models.TextChoices):
    """Types of models"""

    ACTOR = "Actor"
    ENERGYASSET = "EnergyAsset"
    GRIDNODE = "GridNode"
    GRIDCONNECTION = "GridConnection"
    POLICY = "Policy"


class ScenarioRule(models.Model):
    """A rule that finds a selection of objects and updates an attribute according to user input"""

    interactive_element = models.ForeignKey(
        InteractiveElement, on_delete=models.CASCADE, related_name="rules"
    )
    model_type = models.CharField(
        max_length=255, choices=ModelType.choices
    )  # bijv gridconnection of asset
    model_subtype = models.CharField(
        max_length=255, null=True, blank=True
    )  # bijv industry terrain of photovoltaic

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
