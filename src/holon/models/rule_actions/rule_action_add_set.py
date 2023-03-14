from typing import Union
from holon.models.rule_actions import RuleAction

from django.db import models
from django.db.models.query import QuerySet

from holon.models import util

from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from polymorphic import utils

from wagtail.admin.edit_handlers import FieldPanel
from holon.models.rule_actions.rule_action_utils import RuleActionUtils
from holon.models.scenario_rule import ScenarioRule

from holon.models.asset import EnergyAsset
from holon.models.contract import Contract
from holon.models.gridconnection import GridConnection


class GenericRuleActionAdd(RuleAction):
    """Class containing functionality for adding models to the filtered objects or setting the amount of specific type of model"""

    # one of these should be selected
    asset_to_add = models.ForeignKey(EnergyAsset, on_delete=models.SET_NULL, null=True, blank=True)
    gridconnection_to_add = models.ForeignKey(
        GridConnection, on_delete=models.SET_NULL, null=True, blank=True
    )
    contract_to_add = models.ForeignKey(Contract, on_delete=models.SET_NULL, null=True, blank=True)

    content_panels = [
        FieldPanel("asset_to_add"),
        FieldPanel("gridconnection_to_add"),
        FieldPanel("contract_to_add"),
    ]

    def __init__(self, *args, **kwargs):
        super(RuleAction, self).__init__(*args, **kwargs)

        self.__set_model()

    def clean(self):
        super().clean()

        self.__validate_model_selection()
        self.__set_model()

    def __validate_model_selection(self):
        """Validate only a single model type is selected"""

        # thy shall count to one. Not zero, nor two, one is the number to which thy shalt count
        if (
            bool(self.asset_to_add) + bool(self.gridconnection_to_add) + bool(self.contract_to_add)
        ) < 1:
            raise AssertionError(
                f"Assign an object to either the asset, gridconnection or contract field for RuleActionAdd"
            )

        if (
            bool(self.asset_to_add) + bool(self.gridconnection_to_add) + bool(self.contract_to_add)
        ) > 1:
            raise AssertionError(f"Only one of the child models can be set for RuleActionAdd")

    def __set_model(self):
        """Set addition RuleActionAdd attributes according to selected model"""

        # choose which model type is filled in and put it in more general self.model_to_add
        if self.asset_to_add:
            assert not (self.gridconnection_to_add or self.contract_to_add)
            self.model_to_add = self.asset_to_add

        elif self.gridconnection_to_add:
            assert not (self.asset_to_add or self.contract_to_add)
            self.model_to_add = self.gridconnection_to_add

        elif self.contract_to_add:
            assert not (self.asset_to_add or self.gridconnection_to_add)
            self.model_to_add = self.contract_to_add

    panels = [FieldPanel("model_to_add")]

    class Meta:
        verbose_name = "GenericRuleActionAdd"
        abstract = True

    def add_or_set_items(
        self, filtered_queryset: QuerySet, value: str, reset_models_before_add: bool
    ):
        """Add an asset to the first n items in the the filtered objects"""

        # parse value
        n = int(value)
        if n < 0:
            raise ValueError(f"Value to add cannot be smaller than 0. Given value: {n}")

        # get parent type and foreign key field name
        base_parent_type = utils.get_base_polymorphic_model(filtered_queryset[0].__class__)
        try:
            parent_fk_field_name = next(
                parent_fk_fieldname
                for parent_type, parent_fk_fieldname in RuleActionUtils.get_parent_classes_and_field_names(
                    self.model_to_add.__class__
                )
                if base_parent_type == parent_type
            )
        except:
            raise ValueError(
                f"Type {base_parent_type} in the filter does not match found parent type {RuleActionUtils.get_parent_classes_and_field_names(self.model_to_add.__class__)} for model type {self.model_to_add.__class__.__name__}"
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

    rule = ParentalKey(
        ScenarioRule, on_delete=models.SET_NULL, null=True, related_name="discrete_factors_add"
    )

    class Meta:
        verbose_name = "RuleActionAdd"

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """Set the number of filtered objects with the model specified in rule_action_add to value"""

        self.add_or_set_items(filtered_queryset, value, False)


class RuleActionSetCount(GenericRuleActionAdd, ClusterableModel):
    """Set the number of models within the filtered objects"""

    rule = ParentalKey(
        ScenarioRule,
        on_delete=models.SET_NULL,
        null=True,
        related_name="discrete_factors_set_count",
    )

    class Meta:
        verbose_name = "RuleActionSetCount"

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """Set the number of filtered objects with the model specified in rule_action_add to value"""

        self.add_or_set_items(filtered_queryset, value, True)