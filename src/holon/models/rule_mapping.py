from django.apps import apps
from django.db.models import Q
from django.db.models.query import QuerySet

from holon.models.filter import Filter
from holon.models.scenario import Scenario
from holon.models.scenario_rule import ModelType, ScenarioRule
from holon.serializers import InteractiveElementInput


def get_scenario_and_apply_rules(
    scenario_id: int, interactive_element_inputs: list[InteractiveElementInput]
) -> Scenario:
    """Load a scenario, apply rules from interactive elements and return with mapped fields"""

    scenario = get_prefetched_scenario(scenario_id)

    for interactive_element_input in interactive_element_inputs:
        interactive_element = interactive_element_input["interactive_element"]

        for rule in interactive_element.rules.all():
            queryset = get_queryset_for_rule(rule, scenario)

            filtered_queryset = apply_rule_filters_to_queryset(queryset, rule)

            apply_rule_factors(
                rule, queryset, filtered_queryset, interactive_element_input["value"]
            )

    return scenario


def get_prefetched_scenario(scenario_id: int) -> Scenario:
    """Load scenario object from database and return with prefetched fields"""

    scenario = (
        Scenario.objects.prefetch_related("actor_set")
        .prefetch_related("gridconnection_set")
        .prefetch_related("gridconnection_set__energyasset_set")
        .prefetch_related("gridnode_set")
        .prefetch_related("policy_set")
        .get(id=scenario_id)
    )
    return scenario


def get_queryset_for_rule(rule: ScenarioRule, scenario: Scenario) -> QuerySet:
    """Create the queryset for a rule based on its model type and model subtype"""

    if rule.model_type == ModelType.ACTOR.value:
        return scenario.actor_set.all()
    elif rule.model_type == ModelType.ENERGYASSET.value:
        return scenario.assets
    elif rule.model_type == ModelType.GRIDNODE.value:
        return scenario.gridnode_set.all()
    elif rule.model_type == ModelType.GRIDCONNECTION.value:
        return scenario.gridconnection_set.all()
    elif rule.model_type == ModelType.POLICY.value:
        return scenario.policy_set.all()
    else:
        raise Exception("Not implemented model type")


def apply_rule_filters_to_queryset(queryset: QuerySet, rule: ScenarioRule) -> QuerySet:
    """Fetch and apply the rule filters to a queryset"""

    # Use Q() for filtering
    # chaining filter()/exclude() will lead to duplicate records
    # filter with dict destructering doesn't have not equal operator
    queryset_filter = Q()

    filter: Filter
    for filter in rule.filters.all():
        queryset_filter &= filter.get_q()

    if rule.model_subtype:
        submodel = apps.get_model("holon", rule.model_subtype)
        queryset = queryset.instance_of(submodel)

    return queryset.filter(queryset_filter)


def apply_rule_factors(rule: ScenarioRule, queryset: QuerySet, filtered_queryset, value):
    """Apply factors to filtered objects"""

    for factor in rule.factors.all():
        # TODO make more generic if different factors come into play

        for object in filtered_queryset:
            mapped_value = (factor.max_value - factor.min_value) * (
                float(value)
                / 100  # TODO: cast here to float, but bro should that not just be a float?
            ) + factor.min_value

            # Find index from filtered element in prefetched queryset
            queryset_index = next(idx for idx, x in enumerate(queryset) if x.id == object.id)

            # Update object in prefetched scenario
            setattr(queryset[queryset_index], factor.asset_attribute, mapped_value)
