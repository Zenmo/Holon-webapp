from datetime import datetime
import itertools
import math
from typing import Iterator
from holon.models.interactive_element import (
    ChoiceType,
    InteractiveElement,
    InteractiveElementContinuousValues,
    InteractiveElementOptions,
)

from holon.models.scenario import Scenario
from django.core.cache import cache
import argparse

from holon.serializers.interactive_element import InteractiveElementInput


def log_print(msg: str):  # TODO move to utils
    """Print with endpoint name and timestamp prepended"""

    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[cache-runner] [{time}]: {msg}")


class CacheRunner:
    """Class for updating the HolonV2Service cache"""

    @staticmethod
    def update_cache(scenario_ids: list[int] = [], delete_old_records: bool = True):
        """Update the Holon cache by calling the endpoint for each combination in each scenario"""

        log_print("Starting holon cache runner")

        scenarios = CacheRunner.get_scenarios(scenario_ids)
        log_print(f"Found {len(scenarios)} to cache ({[scenario for scenario in scenarios]}).")

        for scenario in scenarios:
            if delete_old_records:
                CacheRunner.delete_scenario_cache_records(scenario)

            CacheRunner.cache_scenario_combinations(scenario)

    @staticmethod
    def delete_scenario_cache_records(scenario: Scenario):
        """Delete the existing cache records for a scenario"""

        log_print(f"Deleting cache records for scenario {scenario} with id {scenario.id}")
        cache.delete(f"holon_cache_{scenario.id}_*")  # TODO use correct key format -TAVM

    @staticmethod
    def cache_scenario_combinations(scenario: Scenario):
        """Cache all possible combinations of interactive element inputs for a single scenario"""

        holon_input_configurations = CacheRunner.get_holon_input_generator(scenario)

        for holon_input_configuration in holon_input_configurations:
            CacheRunner.call_holon_endpoint(holon_input_configuration)

    @staticmethod
    def get_scenarios(scenario_ids: list[int]):
        """Return all uncloned scenarios"""

        if scenario_ids:
            return Scenario.objects.filter(cloned_from__isnull=True, id__in=scenario_ids)

        return Scenario.objects.filter(cloned_from__isnull=True).all()

    @staticmethod
    def get_holon_input_generator(scenario: Scenario) -> Iterator[tuple[InteractiveElementInput]]:
        """Return a HolonInputConfigurationGenerator which can return all possible combinations of input options for each interactive element in a scenario"""

        log_print(
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
        log_print(f"Found {len(interactive_elements)} interactive elements: ")
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

    @staticmethod
    def call_holon_endpoint(holon_input_configuration: tuple[InteractiveElementInput]):

        request_body = str(
            [
                f"{interactive_element_input.interactive_element}: {interactive_element_input.value}"
                for interactive_element_input in holon_input_configuration
            ]
        )
        log_print(f"Calling HolonV2Service endpoint with configuration {request_body}")

        # TODO call endpoint


if __name__ == "__main__":

    # parse arguments
    parser = argparse.ArgumentParser(prog="cache_runner")
    parser.add_argument("-s", help="scenario ids")
    parser.add_argument("-nd", help="delete invalid records")
    args = parser.parse_args()

    delete_old_records = False if args.nd else True

    # update cache
    CacheRunner.update_cache(args.s, delete_old_records)
