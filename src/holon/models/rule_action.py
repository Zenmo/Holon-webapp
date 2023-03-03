from typing import Any
from django.apps import apps
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.db import models
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from polymorphic.models import PolymorphicModel
from django.db.models.query import QuerySet
from django.contrib.postgres.fields import ArrayField

from holon.models.scenario_rule import ScenarioRule
from modelcluster.fields import ParentalKey
import logging

# Create your models here.
class RuleAction(PolymorphicModel):
    """Abstract base class for factors"""

    asset_attribute = models.CharField(max_length=100, default="asset_attribute_not_supplied")

    panels = [FieldPanel("asset_attribute")]

    class Meta:
        verbose_name = "RuleAction"
        # abstract = True

    def clean(self):
        super().clean()

        try:
            if not (
                self.asset_attribute == "asset_attribute_not_supplied"
                or self.asset_attribute in self.asset_attributes_options()
            ):
                raise ValidationError("Invalid value asset_attribute")
        except ObjectDoesNotExist:
            return

    def asset_attributes_options(self):
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [field.name for field in model()._meta.get_fields() if not field.is_relation]

    def apply_action_to_queryset(
        self, queryset: QuerySet, filtered_object: models.Model, value: str
    ):
        """Apply a rule action to an object in the queryset"""
        pass


class RuleActionFactor(RuleAction):
    """A continuous factor for scaling an input value between a certain range"""

    rule = ParentalKey(ScenarioRule, on_delete=models.CASCADE, related_name="continuous_factors")

    min_value = models.IntegerField()
    max_value = models.IntegerField()

    panels = RuleAction.panels + [
        FieldPanel("min_value"),
        FieldPanel("max_value"),
    ]

    class Meta:
        verbose_name = "RuleActionFactor"

    def apply_action_to_queryset(
        self, queryset: QuerySet, filtered_object: models.Model, value: str
    ):
        """
        Apply rescaling of an atribute of filtered_object according to value.
        May throw ValueError if value cannot be parsed to float.
        """

        # rescale value according to min/max
        value_flt = float(value)
        mapped_value = (self.max_value - self.min_value) * (value_flt / 100.0) + self.min_value

        # Find index from filtered element in prefetched queryset
        queryset_index = next(idx for idx, x in enumerate(queryset) if x.id == filtered_object.id)

        # Update object in prefetched scenario
        setattr(queryset[queryset_index], self.asset_attribute, mapped_value)


class RuleActionChangeAttribute(RuleAction):
    """A discrete factor for setting the value of an attribute"""

    rule = ParentalKey(
        ScenarioRule, on_delete=models.CASCADE, related_name="discrete_factors_attribute"
    )

    class Meta:
        verbose_name = "RuleActionChangeAttribute"


class RuleActionAddRemove(RuleAction):
    """A discrete factor for setting the value of an attribute"""

    rule = ParentalKey(
        ScenarioRule, on_delete=models.CASCADE, related_name="discrete_factors_addremove"
    )

    class Meta:
        verbose_name = "RuleActionAddRemove"


class RuleActionBalanceGroup(RuleAction):
    """Blans"""

    rule = ParentalKey(
        ScenarioRule, on_delete=models.CASCADE, related_name="discrete_factors_balancegroup"
    )

    assets = ArrayField(ArrayField(models.CharField(max_length=255, blank=True)))

    panels = RuleAction.panels + [
        FieldPanel("assets"),
    ]

    class Meta:
        verbose_name = "RuleActionBalanceGroup"
