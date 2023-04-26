from typing import Iterator
from holon.cache.cache_runner import get_holon_input_combinations, call_holon_endpoint
from holon.cache.cache_runner.config import Config
from holon.cache import holon_endpoint_cache

from holon.models.scenario import Scenario
from concurrent.futures import ThreadPoolExecutor

from holon.serializers.interactive_element import InteractiveElementInput

N_THREADS = 14


def update_cache(scenario_ids: list[int] = [], delete_old_records: bool = True):
    """Update the Holon cache by calling the endpoint for each combination in each scenario"""

    Config.logger.log_print("Starting holon cache runner")

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


def get_scenarios(scenario_ids: list[int]):
    """Return all uncloned scenarios"""

    if scenario_ids:
        return Scenario.objects.filter(cloned_from__isnull=True, id__in=scenario_ids)

    return Scenario.objects.filter(cloned_from__isnull=True).all()


def run_input_combinations(scenario: Scenario):
    """Run all possible combinations of interactive element inputs for a single scenario to force the endpoint to write each possibility to the cache"""

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


def get_endpoint_call_input_generator(
    scenario_id: int, holon_input_configurations, n_combinations
) -> Iterator[tuple[int, tuple[InteractiveElementInput], int, int]]:

    i = -1
    for holon_input_configuration in holon_input_configurations:
        i += 1
        yield (scenario_id, holon_input_configuration, i, n_combinations)
