from typing import Union
from holon.models.rule_actions import RuleAction

from django.db import models
from modelcluster.fields import ParentalKey
from holon.models.scenario_rule import ScenarioRule
from wagtail.admin.edit_handlers import FieldPanel
from django.db.models.query import QuerySet


class ChangeAttributeOperator(models.TextChoices):
    """Types of supported mathematical operators"""

    SET = "="
    ADD = "+"
    SUBTRACT = "-"
    MULTIPLY = "*"
    DIVIDE = "/"


class RuleActionChangeAttribute(RuleAction):
    """A discrete factor for setting the value of an attribute"""

    model_attribute = models.CharField(max_length=255, null=False)
    operator = models.CharField(max_length=255, choices=ChangeAttributeOperator.choices)

    panels = [FieldPanel("model_attribute"), FieldPanel("operator")]
    rule = ParentalKey(
        ScenarioRule, on_delete=models.CASCADE, related_name="discrete_factors_change_attribute"
    )

    class Meta:
        verbose_name = "RuleActionChangeAttribute"

    def __apply_operator(self, value_old, input_value):
        """Cast the input value to the same type of the old value and apply the chosen operator"""

        # return input value if set
        if self.operator == ChangeAttributeOperator.SET:
            return input_value

        # cast to float to make all operators work as expected
        val_a_flt = float(value_old)
        val_b_flt = float(input_value)

        # apply operator
        if self.operator == ChangeAttributeOperator.ADD:
            return val_a_flt + val_b_flt
        if self.operator == ChangeAttributeOperator.SUBTRACT:
            return val_a_flt - val_b_flt
        if self.operator == ChangeAttributeOperator.MULTIPLY:
            return val_a_flt * val_b_flt
        if self.operator == ChangeAttributeOperator.DIVIDE:
            return val_a_flt / val_b_flt

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """
        Apply an operator with a value to the model attribute
        """

        # apply operators to objects
        for filtered_object in filtered_queryset:
            old_value = getattr(filtered_object, self.model_attribute)
            new_value = self.__apply_operator(old_value, value)

            # change the new value type to the same as the old one
            cast_new_value = type(old_value)(new_value)

            setattr(filtered_object, self.model_attribute, cast_new_value)
            filtered_object.save()
