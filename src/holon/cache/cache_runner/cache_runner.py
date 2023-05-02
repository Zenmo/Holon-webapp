import os
from concurrent.futures import ThreadPoolExecutor
from typing import Iterator

from holon.cache import holon_endpoint_cache
from holon.cache.cache_runner import call_holon_endpoint, get_holon_input_combinations
from holon.cache.cache_runner.call_endpoint import call_cache_check_endpoint
from holon.cache.cache_runner.config import Config
from holon.models.scenario import Scenario
from holon.serializers.interactive_element import InteractiveElementInput

N_THREADS = 14


def update_cache(scenario_ids: list[int] = [], delete_old_records: bool = True):
    """Update the Holon cache by calling the endpoint for each combination in each scenario"""

    Config.logger.log_print("Starting holon cache runner")
    os.environ["CACHE_RUNNER_RUNNING"] = "True"

    # get scenarios
    scenarios = get_scenarios(scenario_ids)
    Config.logger.log_print(
        f"Found {len(scenarios)} to cache ({[f'{scenario} ({scenario.id})' for scenario in scenarios]})."
    )

    # clear scenarios and call endpoint
    for scenario in scenarios:
        if delete_old_records:
            holon_endpoint_cache.clear_scenario(scenario.id)

        run_input_combinations(scenario)


def check_cache(scenario_ids: list[int] = []):
    """Update the Holon cache by calling the endpoint for each combination in each scenario"""

    Config.logger.log_print("Starting holon cache checker")

    # get scenarios
    scenarios = get_scenarios(scenario_ids)
    Config.logger.log_print(
        f"Found {len(scenarios)} to cache ({[f'{scenario} ({scenario.id})' for scenario in scenarios]})."
    )

    # check items for cache
    for scenario in scenarios:
        check_input_combinations(scenario)


def get_scenarios(scenario_ids: list[int]):
    """Return all uncloned scenarios"""

    if scenario_ids:
        return Scenario.objects.filter(cloned_from__isnull=True, id__in=scenario_ids)

    return Scenario.objects.filter(cloned_from__isnull=True).all()


def check_input_combinations(scenario: Scenario) -> int:
    """Check all possible combinations of interactive element inputs for a scenario for existing cache records"""

    holon_input_configurations, n_combinations = get_holon_input_combinations(scenario)

    Config.logger.log_print(
        f"Computed {n_combinations} unique input combinations for scenario {scenario.id}"
    )

    cache_hits = [False] * n_combinations

    for i, input_config in enumerate(holon_input_configurations):
        cache_hit = call_cache_check_endpoint(scenario.id, input_config)
        Config.logger.log_print(f"Cache {'hit' if cache_hit else 'miss'} {i+1}/{n_combinations}")
        cache_hits[i] = cache_hit

    total_cache_hits = sum(cache_hits)

    Config.logger.log_print(f"Total cache hits: {total_cache_hits}")

    return total_cache_hits


def run_input_combinations(scenario: Scenario):
    """Run all possible combinations of interactive element inputs for a single scenario to force the endpoint to write each possibility to the cache"""

    os.environ["CACHE_RUNNER_RUNNING"] = "True"
    holon_input_configurations, n_combinations = get_holon_input_combinations(scenario)

    Config.logger.log_print(
        f"Computed {n_combinations} unique input combinations for scenario {scenario.id}"
    )

    Config.logger.log_print(f"Starting ThreadPoolExecutor with {N_THREADS} cores")
    with ThreadPoolExecutor(max_workers=14) as executor:
        executor.map(
            call_holon_endpoint,
            get_endpoint_call_input_generator(
                scenario.id, holon_input_configurations, n_combinations
            ),
        )

    Config.logger.log_print("Cache runner finished!")


def get_endpoint_call_input_generator(
    scenario_id: int, holon_input_configurations, n_combinations
) -> Iterator[tuple[int, tuple[InteractiveElementInput], int, int]]:
    """
    Function that makes sure the input for the holon endpoint call function is still a generator.
    Generator elements are wrapped in tuples to be able to supply the arguments to the `map` function
    of the ThreadPoolExecutor.
    """

    i = -1
    for holon_input_configuration in holon_input_configurations:
        i += 1
        yield (scenario_id, holon_input_configuration, i, n_combinations)
