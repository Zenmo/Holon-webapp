from holon.models.scenario import Scenario
from holon.models.scenario_rule import ScenarioRule
from holon.serializers import InteractiveElementInput
from holon.models import ChoiceType


def get_scenario_and_apply_rules(
    scenario_id: int, interactive_element_inputs: list[InteractiveElementInput]
) -> Scenario:
    """Load a scenario, apply rules from interactive elements and return with mapped fields"""

    scenario = Scenario.objects.get(id=scenario_id).clone()

    for interactive_element_input in interactive_element_inputs:
        interactive_element = interactive_element_input["interactive_element"]

        if interactive_element.type == ChoiceType.CHOICE_CONTINUOUS:
            interactive_element_options = interactive_element.continuous_values.all()
        else:  # single and multi select
            ids = interactive_element_input["value"].split(",")
            interactive_element_options = interactive_element.options.filter(id__in=ids)

        for option in interactive_element_options:
            value = (
                interactive_element_input["value"]
                if interactive_element.type == ChoiceType.CHOICE_CONTINUOUS
                else option.option
            )
            rule: ScenarioRule
            for rule in option.rules.all():
                filtered_queryset = rule.get_filtered_queryset(scenario)
                rule.apply_rule_actions(filtered_queryset, value)

    return scenario
