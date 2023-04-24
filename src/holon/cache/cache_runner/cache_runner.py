from holon.cache.cache_runner import get_holon_input_combinations, call_holon_endpoint
from holon.cache.cache_runner.config import Config
from holon.cache import holon_endpoint_cache

from holon.models.scenario import Scenario


def update_cache(scenario_ids: list[int] = [], delete_old_records: bool = True):
    """Update the Holon cache by calling the endpoint for each combination in each scenario"""

    Config.logger.log_print("Starting holon cache runner")

    # get scenarios
    scenarios = get_scenarios(scenario_ids)
    Config.logger.log_print(
        f"Found {len(scenarios)} to cache ({[scenario for scenario in scenarios]})."
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

    holon_input_configurations = get_holon_input_combinations(scenario)

    for holon_input_configuration in holon_input_configurations:
        call_holon_endpoint(scenario.id, holon_input_configuration)
