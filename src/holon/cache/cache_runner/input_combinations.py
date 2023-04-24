import itertools
from typing import Iterator
from holon.models.interactive_element import (
    InteractiveElement,
)

from holon.models.scenario import Scenario
from holon.cache.cache_runner.config import Config

from holon.serializers.interactive_element import InteractiveElementInput


def get_holon_input_combinations(scenario: Scenario) -> Iterator[tuple[InteractiveElementInput]]:
    """Return a HolonInputConfigurationGenerator which can return all possible combinations of input options for each interactive element in a scenario"""

    Config.logger.log_print(
        f"Computing possible input combinations for scenario {scenario} with id {scenario.id}"
    )

    # retrieve all individual interactive element input possibilities
    interactive_elements = InteractiveElement.objects.filter(scenario=scenario).all()
    interactive_element_input_lists = [
        [
            InteractiveElementInput(interactive_element, value)
            for value in interactive_element.get_possible_values()
        ]
        for interactive_element in interactive_elements
    ]

    # log our findings
    Config.logger.log_print(f"Found {len(interactive_elements)} interactive elements: ")
    n_combinations = 1
    for interactive_element_input_list in interactive_element_input_lists:
        print(
            f" - {interactive_element_input_list[0].interactive_element}, with {len(interactive_element_input_list)} possible values:"
        )
        print(
            f"   - {[interactive_element_input.value for interactive_element_input in interactive_element_input_list]}"
        )
        n_combinations *= len(interactive_element_input_list)

    print(f"For a total of {n_combinations} possible input combinations")

    # return a generator for all possible combinations
    # TODO take series into account
    return itertools.product(*interactive_element_input_lists)
