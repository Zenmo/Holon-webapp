from __future__ import annotations

from django.forms import ValidationError
from holon.models.actor import Actor
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
from holon.models.scenario import Scenario
from holon.models.asset import EnergyAsset
from holon.models.contract import Contract
from holon.models.gridconnection import GridConnection
from holon.models.scenario_rule import ModelType
from holon.models.filter.attribute_filter_comparator import AttributeFilterComparator

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from holon.rule_engine.scenario_aggregate import ScenarioAggregate
    from holon.rule_engine.repositories.repository_base import RepositoryBaseClass


class GenericRuleActionAdd(RuleAction):
    """Class containing functionality for adding models to the filtered objects or setting the amount of specific type of model"""

    # one of these should be selected
    asset_to_add = models.ForeignKey(
        EnergyAsset,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={"is_rule_action_template": True},
    )
    gridconnection_to_add = models.ForeignKey(
        GridConnection,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={"is_rule_action_template": True},
    )
    contract_to_add = models.ForeignKey(
        Contract,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={"is_rule_action_template": True},
    )

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
            raise ValidationError(
                f"Assign an object to either the asset, gridconnection or contract field for RuleActionAdd"
            )

        if (
            bool(self.asset_to_add) + bool(self.gridconnection_to_add) + bool(self.contract_to_add)
        ) > 1:
            raise ValidationError(f"Only one of the child models can be set for RuleActionAdd")

    def __set_model(self):
        """Set addition RuleActionAdd attributes according to selected model"""

        # choose which model type is filled in and put it in more general self.model_to_add
        if self.asset_to_add:
            assert not (self.gridconnection_to_add or self.contract_to_add)
            self.model_to_add = self.asset_to_add
            self.model_to_add_base_class = EnergyAsset

        elif self.gridconnection_to_add:
            assert not (self.asset_to_add or self.contract_to_add)
            self.model_to_add = self.gridconnection_to_add
            self.model_to_add_base_class = GridConnection

        elif self.contract_to_add:
            assert not (self.asset_to_add or self.gridconnection_to_add)
            self.model_to_add = self.contract_to_add
            self.model_to_add_base_class = Contract

    class Meta:
        verbose_name = "GenericRuleActionAdd"
        abstract = True

    def add_or_set_items(
        self,
        scenario_aggregate: ScenarioAggregate,
        filtered_repository: RepositoryBaseClass,
        value: str,
        reset_models_before_add: bool,
    ) -> ScenarioAggregate:
        """Add an asset to the first n items in the the filtered objects"""

        if filtered_repository.len() <= 0:
            return scenario_aggregate

        if reset_models_before_add:
            # parse value
            n = int(float(value))
            if n < 0:
                raise ValueError(f"Value to add cannot be smaller than 0. Given value: {n}")

        # get parent type and foreign key field name
        base_parent_type = (
            Scenario if filtered_repository is None else filtered_repository.base_model_type
        )  # TODO make sure repository has this
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

        if self.gridconnection_to_add and base_parent_type == Scenario:
            gridconnection_children = RuleActionUtils.get_gridconnection_children(
                self.gridconnection_to_add
            )

        # only take first n objects
        for filtererd_object in filtered_repository.all():
            if reset_models_before_add:
                # check which objects of the same type as model_to_add are already
                # connected to our current filtered_object, and remove these

                model_to_add_repository = scenario_aggregate.get_repository_for_model_type(
                    self.model_to_add_base_class.__name__,
                    model_subtype_name=self.model_to_add.__class__.__name__,
                )

                objects_to_delete = model_to_add_repository.filter_attribute_value(
                    f"{parent_fk_field_name}_id",
                    AttributeFilterComparator.EQUAL,
                    filtererd_object.id,
                )

                for object in objects_to_delete.all():
                    scenario_aggregate.remove_object(object)

            # Only check < n for set count
            if not reset_models_before_add or objects_added < n:
                # add model_to_add to filtered object

                if self.gridconnection_to_add and base_parent_type == Scenario:
                    scenario_aggregate = add_gridconnection_with_children(
                        scenario_aggregate, self.gridconnection_to_add, gridconnection_children
                    )
                else:
                    scenario_aggregate.add_object(
                        self.model_to_add,
                        self.model_to_add_base_class.__name__,
                        {
                            parent_fk_field_name: filtererd_object,
                            f"{parent_fk_field_name}_id": filtererd_object.id,
                            "is_rule_action_template": False,
                        },
                    )

                objects_added += 1

        return scenario_aggregate


class RuleActionAdd(GenericRuleActionAdd, ClusterableModel):
    """Add a set of n models to the filtered items"""

    rule = ParentalKey(
        ScenarioRule, on_delete=models.SET_NULL, null=True, related_name="discrete_factors_add"
    )

    class Meta:
        verbose_name = "RuleActionAdd"

    def hash(self):
        asset_json, gridconnection_json, contract_json = util.serialize_add_models(
            self.asset_to_add, self.gridconnection_to_add, self.contract_to_add
        )

        return f"[A{self.id},{asset_json},{gridconnection_json},{contract_json}]"

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """Set the number of filtered objects with the model specified in rule_action_add to value"""

        self.add_or_set_items_old(filtered_queryset, value, False)

    def apply_to_scenario_aggregate(
        self,
        scenario_aggregate: ScenarioAggregate,
        filtered_repository: RepositoryBaseClass,
        value: str,
    ) -> ScenarioAggregate:
        """Apply rule action add to the scenario aggregate using objects in the repository"""

        return self.add_or_set_items(scenario_aggregate, filtered_repository, value, False)


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

    def hash(self):
        asset_json, gridconnection_json, contract_json = util.serialize_add_models(
            self.asset_to_add, self.gridconnection_to_add, self.contract_to_add
        )

        return f"[A{self.id},{asset_json},{gridconnection_json},{contract_json}]"

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """Set the number of filtered objects with the model specified in rule_action_add to value"""

        self.add_or_set_items_old(filtered_queryset, value, True)

    def apply_to_scenario_aggregate(
        self,
        scenario_aggregate: ScenarioAggregate,
        filtered_repository: RepositoryBaseClass,
        value: str,
    ) -> ScenarioAggregate:
        """Apply rule action set to the scenario aggregate using objects in the repository"""

        return self.add_or_set_items(scenario_aggregate, filtered_repository, value, True)


class RuleActionAddMultipleUnderEachParent(GenericRuleActionAdd, ClusterableModel):
    """Add a number of duplicate objects for each of the filtered objects"""

    rule = ParentalKey(
        ScenarioRule,
        on_delete=models.SET_NULL,
        null=True,
        related_name="discrete_factors_add_multiple_under_each_parent",
    )

    def hash(self):
        asset_json, gridconnection_json, contract_json = util.serialize_add_models(
            self.asset_to_add, self.gridconnection_to_add, self.contract_to_add
        )

        return f"[A{self.id},{asset_json},{gridconnection_json},{contract_json}]"

    class Meta:
        verbose_name = "RuleActionAddMultipleUnderEachParent"

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """Set the number of filtered objects with the model specified in rule_action_add to value"""

        # parse value
        n = int(float(value))
        if n < 0:
            raise ValueError(f"Value to add cannot be smaller than 0. Given value: {n}")

        # get parent type and foreign key field name
        base_parent_type = RuleActionUtils.get_base_polymorphic_model(
            filtered_queryset[0].__class__
        )
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

        # only take first n objects
        for filtererd_object in filtered_queryset:
            for _ in range(n):
                util.duplicate_model(
                    self.model_to_add,
                    {
                        parent_fk_field_name: filtererd_object,
                        "is_rule_action_template": False,
                    },
                )

    # TODO childmodel duplicate code SEM herstellen
    def apply_to_scenario_aggregate(
        self,
        scenario_aggregate: ScenarioAggregate,
        filtered_repository: RepositoryBaseClass,
        value: str,
    ) -> ScenarioAggregate:
        """Set the number of filtered objects with the model specified in rule_action_add to value"""

        # parse value
        n = int(float(value))
        if n < 0:
            raise ValueError(f"Value to add cannot be smaller than 0. Given value: {n}")

        # get parent type and foreign key field name

        base_parent_type = (
            Scenario if filtered_repository is None else filtered_repository.base_model_type
        )
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
                f"Type {filtered_repository.base_model_type} in the filter does not match found parent type {RuleActionUtils.get_parent_classes_and_field_names(self.model_to_add.__class__)} for model type {self.model_to_add.__class__.__name__}"
            )

        if self.gridconnection_to_add and base_parent_type == Scenario:
            gridconnection_children = RuleActionUtils.get_gridconnection_children(
                self.gridconnection_to_add
            )

        # only take first n objects
        for filtererd_object in filtered_repository.all():
            for _ in range(n):
                if self.gridconnection_to_add and base_parent_type == Scenario:
                    scenario_aggregate = add_gridconnection_with_children(
                        scenario_aggregate, self.gridconnection_to_add, gridconnection_children
                    )
                else:
                    scenario_aggregate.add_object(
                        self.model_to_add,
                        self.model_to_add_base_class.__name__,
                        {
                            parent_fk_field_name: filtererd_object,
                            f"{parent_fk_field_name}_id": filtererd_object.id,
                            "is_rule_action_template": False,
                        },
                    )

        return scenario_aggregate


def add_gridconnection_with_children(
    scenario_aggregate: ScenarioAggregate,
    gridconnection: GridConnection,
    children: tuple[list[EnergyAsset], Actor, list[Contract]],
) -> ScenarioAggregate:
    """Add gridconnection with children to scenario aggregate"""
    assets, actor, actor_contracts = children

    if actor is not None:
        added_actor = scenario_aggregate.add_object(
            actor,
            ModelType.ACTOR.value,
            {
                "payload": scenario_aggregate.scenario,
                "payload_id": scenario_aggregate.scenario.id,
                "is_rule_action_template": False,
            },
        )

        for contract in actor_contracts:
            scenario_aggregate.add_object(
                contract,
                ModelType.CONTRACT.value,
                {
                    "actor": added_actor,
                    "actor_id": added_actor.id,
                    "is_rule_action_template": False,
                },
            )
    else:
        added_actor = None

    added_gridconnection = scenario_aggregate.add_object(
        gridconnection,
        ModelType.GRIDCONNECTION.value,
        {
            "payload": scenario_aggregate.scenario,
            "payload_id": scenario_aggregate.scenario.id,
            "owner_actor": added_actor,
            "owner_actor_id": getattr(added_actor, "id", None),
            "is_rule_action_template": False,
        },
    )

    for asset in assets:
        scenario_aggregate.add_object(
            asset,
            ModelType.ENERGYASSET.value,
            {
                "gridconnection": added_gridconnection,
                "gridconnection_id": added_gridconnection.id,
                "is_rule_action_template": False,
            },
        )

    return scenario_aggregate
