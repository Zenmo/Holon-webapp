from holon.models.scenario import Scenario
from holon.models.scenario_rule import ScenarioRule
from holon.serializers import InteractiveElementInput
from holon.models import ChoiceType
from holon.services.clone_scenario import clone_scenario
from pipit.sentry import sentry_sdk_trace
from src.holon.rule_engine.scenario_aggregate import ScenarioAggregate


def get_scenario_and_apply_rules(
    scenario_id: int, interactive_element_inputs: list[InteractiveElementInput]
) -> Scenario:
    """Load a scenario, apply rules from interactive elements and return with mapped fields"""

    # clone scenario
    scenario = Scenario.objects.get(id=scenario_id)

    return apply_rules_old(scenario, interactive_element_inputs)


# TODO remove after rule engine update
@sentry_sdk_trace
def apply_rules_old(
    scenario: Scenario, interactive_element_inputs: list[InteractiveElementInput]
) -> Scenario:
    """Load a scenario, apply rules from interactive elements and return with mapped fields"""

    # clone scenario
    scenario = clone_scenario(scenario)

    # apply rules belonging to interactive elements
    for interactive_element_input in interactive_element_inputs:
        interactive_element = interactive_element_input["interactive_element"]

        if interactive_element.type == ChoiceType.CHOICE_CONTINUOUS:
            interactive_element_options = interactive_element.continuous_values.all()
        else:  # single and multi select
            options = interactive_element_input["value"].split(",")
            interactive_element_options = interactive_element.options.filter(option__in=options)

        for option in interactive_element_options:
            value = (
                interactive_element_input["value"]
                if interactive_element.type == ChoiceType.CHOICE_CONTINUOUS
                else option.option
            )

            # apply filters and rule actions
            rule: ScenarioRule
            for rule in option.rules.all():
                # transform value if applicable
                transformed_value = rule.apply_value_transforms(value)

                filtered_queryset = rule.get_filtered_queryset(scenario)
                filtered_queryset = rule.apply_filter_subselections(
                    filtered_queryset, transformed_value
                )
                rule.apply_rule_actions_old(filtered_queryset, transformed_value)

    return scenario


def apply_rules(
    scenario_aggregate: ScenarioAggregate, interactive_element_inputs: list[InteractiveElementInput]
) -> ScenarioAggregate:
    """Load a scenario, apply rules from interactive elements and return with mapped fields"""

    for interactive_element_input in interactive_element_inputs:
        interactive_element = interactive_element_input["interactive_element"]

        if interactive_element.type == ChoiceType.CHOICE_CONTINUOUS:
            interactive_element_options = interactive_element.continuous_values.all()

        else:  # single and multi select
            options = interactive_element_input["value"].split(",")
            interactive_element_options = interactive_element.options.filter(option__in=options)

        for option in interactive_element_options:
            value = (
                interactive_element_input["value"]
                if interactive_element.type == ChoiceType.CHOICE_CONTINUOUS
                else option.option
            )

            # apply filters and rule actions
            rule: ScenarioRule
            for rule in option.rules.all():
                # transform value if applicable
                transformed_value = rule.apply_value_transforms(value)

                filtered_repository = rule.get_filtered_repository(scenario_aggregate)

                filtered_repository = rule.subselect_repository(
                    scenario_aggregate, filtered_repository, transformed_value
                )
                scenario_aggregate = rule.apply_rule_actions(
                    scenario_aggregate, filtered_repository, transformed_value
                )

    return scenario_aggregate
