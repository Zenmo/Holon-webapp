from holon.models.rule_actions import RuleAction

from django.db import models
from django.db.models.query import QuerySet

from holon.models import util

from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from polymorphic import utils

from wagtail.admin.edit_handlers import FieldPanel
from holon.models.rule_actions.rule_action_model import RuleActionModel
from holon.models.scenario_rule import ScenarioRule


class GenericRuleActionAdd(RuleAction):
    """Class containing functionality for adding models to the filtered objects or setting the amount of specific type of model"""

    # one of these should be selected
    model_to_add = models.ForeignKey(RuleActionModel, on_delete=models.SET_NULL)

    panels = RuleAction.panels + [
        FieldPanel("model_to_add"),
    ]

    class Meta:
        verbose_name = "GenericRuleActionAdd"
        abstract = True


    def add_or_set_items(self, filtered_queryset: QuerySet, value: str, reset_models_before_add: bool):
        """Add an asset to the first n items in the the filtered objects"""

        # parse value
        n = int(value)
        if n < 0:
            raise ValueError(f"Value to add cannot be smaller than 0. Given value: {n}")

        # get parent type and foreign key field name
        parent_type = utils.get_base_polymorphic_model(filtered_queryset[0].__class__)
        try:
            parent_fk_field_name = next(
                parent_type_and_fieldname[1]
                for parent_type_and_fieldname in self.model_to_add.get_parent_classes_and_field_names()
                if parent_type == parent_type_and_fieldname[0]
            )
        except:
            raise ValueError(
                f"Type {parent_type} in the filter does not match found parent type {self.model_to_add.get_parent_classes_and_field_names()} for model type {self.model_to_add.__class__.__name__}"
            )

        objects_added = 0

        # only take first n objects
        for filtererd_object in filtered_queryset:

            if not self.model_to_add.__class__.objects.filter(
                **{parent_fk_field_name: filtererd_object}
            ).exists():
                if objects_added < n:
                    # add model_to_add to filtered object
                    util.duplicate_model(
                        self.model_to_add, {parent_fk_field_name: filtererd_object}
                    )
                    objects_added += 1

            # `set_count` mode, delete the objects of the model class under the filtered objects
            elif reset_models_before_add:
                self.model_to_add.__class__.objects.filter(
                    **{parent_fk_field_name: filtererd_object}
                ).delete()


class RuleActionAdd(GenericRuleActionAdd, ClusterableModel):
    """Add a set of n models to the filtered items"""

    rule = ParentalKey(ScenarioRule, on_delete=models.CASCADE, related_name="discrete_factors_add")

    class Meta:
        verbose_name = "RuleActionAdd"

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """Set the number of filtered objects with the model specified in rule_action_add to value"""

        self.add_or_set_items(filtered_queryset, value, False)


class RuleActionSetCount(GenericRuleActionAdd, ClusterableModel):
    """ Set the number of models within the filtered objects """
    rule = ParentalKey(
        ScenarioRule, on_delete=models.CASCADE, related_name="discrete_factors_set_count"
    )

    class Meta:
        verbose_name = "RuleActionSetCount"

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """Set the number of filtered objects with the model specified in rule_action_add to value"""

        self.add_or_set_items(filtered_queryset, value, True)

