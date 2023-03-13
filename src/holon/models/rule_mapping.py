from django.apps import apps
from django.db.models import Q
from django.db.models.query import QuerySet

from holon.models.filter import Filter
from holon.models.rule_actions.rule_action import RuleAction
from holon.models.scenario import Scenario
from holon.models.scenario_rule import ModelType, ScenarioRule
from holon.serializers import InteractiveElementInput


def get_scenario_and_apply_rules(
    scenario_id: int, interactive_element_inputs: list[InteractiveElementInput]
) -> Scenario:
    """Load a scenario, apply rules from interactive elements and return with mapped fields"""

    scenario = get_cloned_scenario(scenario_id=scenario_id)

    for interactive_element_input in interactive_element_inputs:
        interactive_element = interactive_element_input["interactive_element"]

        for rule in interactive_element.rules.all():
            queryset = get_queryset_for_rule(rule, scenario)

            filtered_queryset = apply_rule_filters_to_queryset(queryset, rule)

            for value in interactive_element_input["value"].split(","):
                apply_rule_actions(rule, filtered_queryset, value)

    return scenario


def get_cloned_scenario(scenario_id: int) -> Scenario:
    """Load scenario object from database and clone it"""

    scenario = Scenario.objects.get(id=scenario_id)
    return scenario.clone()


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

    # filter: Filter
    for filter in rule.get_filters():
        queryset_filter &= filter.get_q()

    if rule.model_subtype:
        submodel = apps.get_model("holon", rule.model_subtype)
        queryset = queryset.instance_of(submodel)

    return queryset.filter(queryset_filter)


def apply_rule_actions(rule: ScenarioRule, filtered_queryset: QuerySet, value: str):
    """Apply rule actions to filtered objects"""

    rule_action: RuleAction
    for rule_action in rule.get_actions():
        rule_action.apply_action_to_queryset(filtered_queryset, value)
