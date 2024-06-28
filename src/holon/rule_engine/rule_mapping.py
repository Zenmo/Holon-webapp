import random
from holon.models.scenario_rule import ScenarioRule
from holon.serializers import InteractiveElementInput
from holon.models import ChoiceType, InteractiveElementContinuousValues, InteractiveElementOptions
from pipit.sentry import sentry_sdk_trace
from holon.rule_engine.scenario_aggregate import ScenarioAggregate


@sentry_sdk_trace
def apply_rules(
    scenario_aggregate: ScenarioAggregate, interactive_element_inputs: list[InteractiveElementInput]
) -> ScenarioAggregate:
    """Load a scenario, apply rules from interactive elements and return with mapped fields"""
    number_generator = random.Random(42)

    for interactive_element_input in interactive_element_inputs:
        interactive_element = interactive_element_input.interactive_element

        if interactive_element.type == ChoiceType.CHOICE_CONTINUOUS:
            interactive_element_options: list[InteractiveElementContinuousValues] = (
                interactive_element.continuous_values.all()
            )

        else:  # single and multi select
            options = interactive_element_input.value.split(",")
            interactive_element_options: list[InteractiveElementOptions] = (
                interactive_element.options.filter(option__in=options)
            )

        for option in interactive_element_options:
            value = (
                interactive_element_input.value
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
                    filtered_repository, transformed_value, number_generator
                )
                scenario_aggregate = rule.apply_rule_actions(
                    scenario_aggregate, filtered_repository, transformed_value, number_generator
                )

    return scenario_aggregate
