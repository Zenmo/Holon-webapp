from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from holon.rule_engine.scenario_aggregate import ScenarioAggregate
    from holon.rule_engine.repositories.repository_base import RepositoryBaseClass

from holon.models.rule_actions import RuleAction
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from django.db import models
from modelcluster.fields import ParentalKey
from holon.models.scenario_rule import ScenarioRule
from wagtail.admin.edit_handlers import FieldPanel
from django.db.models.query import QuerySet

import numpy as np


class NoiseType(models.TextChoices):
    """Types of supported mathematical operators"""

    UNIFORM = "UNIFORM"
    NORMAL = "NORMAL"
    TRIANGLE = "TRIANGLE"


class RuleActionAttributeNoise(RuleAction):
    """A discrete factor for setting the value of an attribute"""

    model_attribute = models.CharField(max_length=255, null=False)
    noise_type = models.CharField(max_length=31, choices=NoiseType.choices)
    min_value = models.FloatField(default=0.0)
    max_value = models.FloatField(default=0.0)
    mean = models.FloatField(default=0.0)
    sigma = models.FloatField(default=0.0)
    rule: ScenarioRule = ParentalKey(
        ScenarioRule, on_delete=models.CASCADE, related_name="discrete_factors_attribute_noise"
    )

    panels = [
        FieldPanel("model_attribute"),
        FieldPanel("noise_type"),
        FieldPanel("min_value"),
        FieldPanel("max_value"),
        FieldPanel("mean"),
        FieldPanel("sigma"),
    ]

    class Meta:
        verbose_name = "RuleActionAttributeNoise"

    def clean(self):
        super().clean()

        try:
            if not self.model_attribute in self.rule.get_model_attributes_options():
                raise ValidationError(f"Invalid value {self.model_attribute} for model_attribute")
        except ObjectDoesNotExist:
            return

    def hash(self):
        return f"[A{self.id},{self.model_attribute},{self.noise_type},{self.min_value},{self.max_value},{self.mean},{self.sigma}]"

    def __apply_noise(self, value: float):
        """Cast the input value to the same type of the old value and apply the chosen operator"""

        if self.noise_type == NoiseType.UNIFORM.value:
            return value + np.random.uniform(self.min_value, self.max_value)
        elif self.noise_type == NoiseType.NORMAL.value:
            return value + np.random.normal(self.mean, self.sigma)
        elif self.noise_type == NoiseType.TRIANGLE.value:
            return value + np.random.triangular(self.min_value, self.mean, self.max_value)

        raise NotImplementedError(
            f"RuleActionAttributeNoise: Noise type {self.noise_type} not recognized"
        )

    def apply_to_scenario_aggregate(
        self,
        scenario_aggregate: ScenarioAggregate,
        filtered_repository: RepositoryBaseClass,
        value: str,
    ) -> ScenarioAggregate:
        """Apply noise to attributes of objects in the repository"""

        model_attribute = self.model_attribute

        # apply operators to objects
        for filtered_object in filtered_repository.all():
            value = float(getattr(filtered_object, model_attribute))
            new_value = self.__apply_noise(value)

            setattr(filtered_object, model_attribute, new_value)
            scenario_aggregate.repositories[filtered_repository.base_model_type.__name__].update(
                filtered_object
            )

        return scenario_aggregate
