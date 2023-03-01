import logging
from typing import Any

from django.apps import apps
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.query import QuerySet
from polymorphic.models import PolymorphicModel
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel

from holon.models.scenario_rule import ScenarioRule


# Create your models here.
class RuleAction(PolymorphicModel):
    """Abstract base class for factors"""

    asset_attribute = models.CharField(max_length=100, default="asset_attribute_not_supplied")
    rule = models.ForeignKey(ScenarioRule, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "RuleAction"
        # abstract = True

    def clean(self):
        super().clean()

        if not (
            self.asset_attribute == "asset_attribute_not_supplied"
            or self.asset_attribute in self.asset_attributes_options()
        ):
            raise ValidationError("Invalid value asset_attribute")

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

    min_value = models.IntegerField()
    max_value = models.IntegerField()

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

        setattr(filtered_object, self.asset_attribute, mapped_value)
        filtered_object.save()


class RuleActionChangeAttribute(RuleAction):
    """A discrete factor for setting the value of an attribute"""

    class Meta:
        verbose_name = "RuleActionChangeAttribute"


class RuleActionAddRemove(RuleAction):
    """A discrete factor for setting the value of an attribute"""

    class Meta:
        verbose_name = "RuleActionAddRemove"


class RuleActionBalanceGroup(RuleAction):
    """Blans"""

    assets = ArrayField(ArrayField(models.CharField(max_length=255, blank=True)))

    class Meta:
        verbose_name = "RuleActionBalanceGroup"
