from datetime import datetime

from holon.models.scenario import Scenario
from django.core.cache import cache


def log_print(msg: str):  # TODO move to utils
    """Print with endpoint name and timestamp prepended"""

    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[cache-runner] [{time}]: {msg}")


class HolonInputConfiguration:
    """Represents a single configuration of interactive element values for a scenario"""

    def __init__(self) -> None:
        pass

    def get_request_body(self) -> str:
        pass

    def call_holon_endpoint(self):
        pass


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
        cache.delete(f"holon_cache_{scenario.id}_*")  # TODO

    @staticmethod
    def cache_scenario_combinations(scenario: Scenario):
        """Cache all possible combinations of interactive element inputs for a single scenario"""

        holon_configurations = CacheRunner.compute_configurations(scenario)
        log_print(f"Computed {len(holon_configurations)} input combinations")

        for holon_configuation in holon_configurations:
            log_print(
                f"Calling HolonV2Service endpoint with configuration {holon_configuation.get_request_body()}"
            )
            holon_configuation.call_holon_endpoint()

    @staticmethod
    def get_scenarios(scenario_ids: list[int]):
        """Return all uncloned scenarios"""

        if scenario_ids:
            return Scenario.objects.filter(cloned_from__isnull=True, id__in=scenario_ids)

        return Scenario.objects.filter(cloned_from__isnull=True).all()

    @staticmethod
    def compute_configurations(scenario: Scenario) -> list[HolonInputConfiguration]:

        log_print(
            f"Computing possible input combinations for scenario {scenario} with id {scenario.id}"
        )
        pass


if __name__ == "__main__":

    CacheRunner.update_cache()
