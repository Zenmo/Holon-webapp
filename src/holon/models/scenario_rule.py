from typing import Union
from django.apps import apps
from django.core.exceptions import ValidationError
from django.db import models
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel, MultiFieldPanel
from polymorphic.models import PolymorphicModel
from holon.models.filter import Filter

from holon.models.interactive_element import (
    InteractiveElementOptions,
    InteractiveElementContinuousValues,
)
from holon.models.scenario import Scenario
from holon.models.util import all_subclasses
from django.db.models.query import QuerySet
from django.db.models import Q
from holon.models.config.datamodel_conversion import DatamodelConversion


class ModelType(models.TextChoices):
    """Types of models"""

    ACTOR = "Actor"
    CONTRACT = "Contract"
    ENERGYASSET = "EnergyAsset"
    GRIDNODE = "GridNode"
    GRIDCONNECTION = "GridConnection"
    POLICY = "Policy"
    SCENARIO = "Scenario"


class Rule(PolymorphicModel, ClusterableModel):
    """Superclass for rule"""

    model_type = models.CharField(
        max_length=255, choices=ModelType.choices
    )  # bijv gridconnection of asset
    model_subtype = models.CharField(
        max_length=255, null=True, blank=True
    )  # bijv industry terrain of photovoltaic

    class Meta:
        verbose_name = "Rule"

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
                InlinePanel(
                    "second_order_relation_attribute_filters",
                    heading="Second order relation attribute filters",
                    label="Second order relation attribute filters",
                ),
                InlinePanel(
                    "relation_exists_filters",
                    heading="Relation exists filters",
                    label="Relation exists filters",
                ),
            ],
        ),
    ]

    def clean(self):
        """Verify whether model_subtype actually is a subtype of model_type"""

        super().clean()

        if (
            self.model_subtype is not None
            and self.model_subtype != ""
            and self.model_subtype not in self.model_subtype_options()
        ):
            raise ValidationError("Invalid value model_subtype")

    def get_model_attributes_options(self) -> list[str]:
        """Get the possible asset attributes for a certain model type"""

        model_type = self.model_type if self.model_subtype is None else self.model_subtype
        model = apps.get_model("holon", model_type)

        return [field.name for field in model()._meta.get_fields() if not field.is_relation]

    def model_subtype_options(self) -> list[str]:
        """Get a list of subclass names of the Rule's model type"""

        model_type_class = apps.get_model("holon", self.model_type)
        return [subclass.__name__ for subclass in all_subclasses(model_type_class)]

    def get_filters(self) -> list[Filter]:
        """Get a list of filter objects related to this Rule instance"""

        return (
            list(self.attribute_filters.all())
            + list(self.relation_attribute_filters.all())
            + list(self.second_order_relation_attribute_filters.all())
            + list(self.relation_exists_filters.all())
            + list(self.discrete_attribute_filters.all())
        )

    def get_queryset(self, scenario: Scenario) -> QuerySet:
        """Create the queryset for a rule based on its model type and model subtype"""

        if self.model_type == ModelType.ACTOR.value:
            return scenario.actor_set.all()
        elif self.model_type == ModelType.ENERGYASSET.value:
            return scenario.assets
        elif self.model_type == ModelType.GRIDNODE.value:
            return scenario.gridnode_set.all()
        elif self.model_type == ModelType.GRIDCONNECTION.value:
            return scenario.gridconnection_set.all()
        elif self.model_type == ModelType.POLICY.value:
            return scenario.policy_set.all()
        elif self.model_type == ModelType.CONTRACT.value:
            return scenario.contracts
        elif self.model_type == ModelType.SCENARIO.value:
            return Scenario.objects.filter(id=scenario.id)
        else:
            raise Exception("Not implemented model type")

    def apply_filters_to_queryset(self, queryset: QuerySet) -> QuerySet:
        """Fetch and apply the rule filters to a queryset"""

        # Use Q() for filtering
        # chaining filter()/exclude() will lead to duplicate records
        # filter with dict destructering doesn't have not equal operator
        queryset_filter = Q()

        # filter: Filter
        for filter in self.get_filters():
            queryset_filter &= filter.get_q()

        if self.model_subtype:
            submodel = apps.get_model("holon", self.model_subtype)
            queryset = queryset.instance_of(submodel)

        # Use distinct because of relation filters
        #   e.q. a filter on gridconnections where energyasset have certain properties will produce duplicate gridconnection in the queryset
        return queryset.filter(queryset_filter).distinct()

    def get_filtered_queryset(self, scenario: Scenario) -> QuerySet:
        """Return a queryset based on the Rule's model (sub)type and filters"""

        queryset = self.get_queryset(scenario)
        filtered_queryset = self.apply_filters_to_queryset(queryset)

        return filtered_queryset


class ScenarioRule(Rule):
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

    panels = (
        [Rule.panels[0]]
        + [
            MultiFieldPanel(
                heading="Interactive element value transform",
                children=[
                    InlinePanel(
                        "value_translates",
                        heading="Add or subtract",
                        label="Value translate",
                    ),
                    InlinePanel(
                        "value_scales",
                        heading="Scale",
                        label="Value scale",
                    ),
                    InlinePanel(
                        "value_map_ranges",
                        heading="Map to a different range",
                        label="Value map range",
                    ),
                    InlinePanel(
                        "value_rounds",
                        heading="Round",
                        label="Value round",
                    ),
                ],
            ),
        ]
        + Rule.panels[1:]
        + [
            MultiFieldPanel(
                heading="Filter subselection",
                children=[
                    InlinePanel(
                        "subselector_skips",
                        heading="Skip a number of filtered items",
                        label="Filter item skip",
                    ),
                    InlinePanel(
                        "subselector_takes",
                        heading="Take a number of filtered items",
                        label="Filter item take",
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
                    InlinePanel(
                        "discrete_factors_add_multiple_under_each_parent",
                        heading="Discrete rule actions - add duplicate objects",
                        label="Discrete rule action - add duplicate objects",
                    ),
                ],
            ),
        ]
    )

    class Meta:
        verbose_name = "ScenarioRule"

    def get_value_transforms(self) -> list["ValueTransform"]:
        """Get a list of the value transform items"""

        return (
            list(self.value_translates.all())
            + list(self.value_scales.all())
            + list(self.value_map_ranges.all())
            + list(self.value_rounds.all())
        )

    def apply_value_transforms(self, value: str) -> Union[str, int, float]:
        """Apply the rule's value transforms to the interactive element value"""

        for value_transform in self.get_value_transforms():
            value = value_transform.transform_value(value)

        return value

    def get_filter_subselectors(self) -> list["FilterSubSelector"]:
        """Get a list of the filter subselection items"""

        return list(self.subselector_skips.all()) + list(self.subselector_takes.all())

    def apply_filter_subselections(self, filtered_queryset: QuerySet, value: str):
        """Apply the rule's query subselection to the filtered queryset"""

        for subselector in self.get_filter_subselectors():
            filtered_queryset = subselector.subselect_queryset(filtered_queryset, value)

        return filtered_queryset

    def get_actions(self) -> list["RuleAction"]:
        """Return a list of RuleActions belonging to this rule"""

        return (
            list(self.continuous_factors.all())
            + list(self.discrete_factors_change_attribute.all())
            + list(self.discrete_factors_add.all())
            + list(self.discrete_factors_remove.all())
            + list(self.discrete_factors_set_count.all())
            + list(self.discrete_factors_balancegroup.all())
            + list(self.discrete_factors_add_multiple_under_each_parent.all())
        )

    def apply_rule_actions(self, filtered_queryset: QuerySet, value: str):
        """Apply rule actions to filtered objects"""

        for rule_action in self.get_actions():
            rule_action.apply_action_to_queryset(filtered_queryset, value)

    def hash(self):
        action_hashes = ",".join([rule_action.hash() for rule_action in self.get_actions()])
        filter_hashes = ",".join([rule_filter.hash() for rule_filter in self.get_filters()])
        subselector_hashes = ",".join(
            [rule_subselector.hash() for rule_subselector in self.get_filter_subselectors()]
        )
        transform_hashes = ",".join(
            [rule_transform.hash() for rule_transform in self.get_value_transforms()]
        )

        return f"[R{self.id},{self.model_type},{self.model_subtype},{action_hashes},{filter_hashes},{subselector_hashes},{transform_hashes}]"


class SelfConversionType(models.TextChoices):
    """Applied to the resulting set of objects attribute values before conversion"""

    SUM = "SUM"  # sum the selected attribute of the query result
    COUNT = "COUNT"  # sum the selected attribute of the query result


class DatamodelQueryRule(Rule):
    """A rule that finds a selection of objects and returns the count or attribute sum based on configuration of filters"""

    self_conversion = models.CharField(max_length=255, choices=SelfConversionType.choices)
    datamodel_conversion_step = ParentalKey(
        DatamodelConversion, related_name="datamodel_query_rule"
    )

    attribute_to_sum = models.CharField(
        max_length=255, null=True, blank=True
    )  # bijv capacityEletricity_kW

    panels = (
        Rule.panels
        + [  # TODO order these panels between the model_(sub)type panels and the filter panels
            FieldPanel("self_conversion"),
            FieldPanel("attribute_to_sum"),  # TODO only show if self_conversion is SUM
        ]
    )

    class Meta:
        verbose_name = "DatamodelQueryRule"

    def clean(self):
        """Check if attribute_to_sum field is filled in when conversion type is SUM and whether it is a valid attribute for model type"""

        super().clean()

        if self.self_conversion == SelfConversionType.SUM.value:
            if not self.attribute_to_sum:
                raise ValidationError(
                    "attribute_to_sum field should be set if self_conversion is SUM"
                )

            if not self.attribute_to_sum in self.get_model_attributes_options():
                raise ValidationError(
                    f"{self.model_subtype if self.model_subtype else self.model_type} has no attribute {self.attribute_to_sum}"
                )

    def get_filters_object_count(self, scenario: Scenario) -> int:
        """Get the number of objects in the combined filter resutls"""

        filtered_queryset = self.get_filtered_queryset(scenario)
        return filtered_queryset.count()

    def get_filters_attribute_sum(self, scenario: Scenario) -> float:
        """Return the sum of a specific attribute of all objects in a queryset"""

        filtered_queryset = self.get_filtered_queryset(scenario)

        attr_sum = 0.0
        for filtered_object in filtered_queryset:
            try:
                value = float(getattr(filtered_object, self.attribute_to_sum))
                attr_sum += value
            except Exception as e:
                print(
                    f"Something went wrong while summing model attributes, let's act as if nothing happend and keep going ({e})"
                )

        return attr_sum

    def get_filter_aggregation_result(self, scenario: Scenario) -> Union[int, float]:
        """Get the filter aggregation result based on the datamodel query rule's conversion type"""

        if self.self_conversion == SelfConversionType.COUNT.value:
            return self.get_filters_object_count(scenario)

        elif self.self_conversion == SelfConversionType.SUM.value:
            return self.get_filters_attribute_sum(scenario)

        raise ValidationError("No valid conversion type set")
