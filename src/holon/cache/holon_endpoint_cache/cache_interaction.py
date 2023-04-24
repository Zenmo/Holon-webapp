from django.core.cache import caches
import json
from django.conf import settings

from holon.cache.holon_endpoint_cache.config import Config


def set(key: str, result: dict) -> None:
    """Set a record int the holon_cache database"""

    result = json.dumps(result)
    caches[Config.cache_name].set(key, result, timeout=settings.HOLON_CACHING_TIMEOUT)
    Config.logger.log_print("Holon cache write: ", key, result)


def get(key: str) -> dict:
    """Get a record from the holon_cache database"""

    value = caches[Config.cache_name].get(key)

    if not value:
        Config.logger.log_print("HOLON cache miss. key:", key)
    else:
        value = json.loads(value)

    return value


def clear_scenario(scenario_id: int):
    """Remove all records of a specific scenario in the holon cache"""

    Config.logger.log_print(f"Deleting cache records for scenario with id {scenario_id}")

    caches[Config.cache_name].clear_scenario(scenario_id)
