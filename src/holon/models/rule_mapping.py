from holon.models.scenario import Scenario
from holon.models.scenario_rule import ScenarioRule
from holon.serializers import InteractiveElementInput
from holon.models import ChoiceType
from pipit.sentry import sentry_sdk_trace


@sentry_sdk_trace
def get_scenario_and_apply_rules(
    scenario_id: int, interactive_element_inputs: list[InteractiveElementInput]
) -> Scenario:
    """Load a scenario, apply rules from interactive elements and return with mapped fields"""

    # clone scenario
    scenario = Scenario.objects.get(id=scenario_id).clone()

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
                rule.apply_rule_actions(filtered_queryset, transformed_value)

    return scenario
