from django.core.cache import caches
import json
from django.conf import settings

from holon.cache.holon_endpoint_cache.config import Config
from holon.utils.logging import HolonLogger


def set(key: str, result: dict) -> None:
    """Set a record int the holon_cache database"""

    try:
        result = json.dumps(result)
        caches[Config.cache_name].set(key, result, timeout=settings.HOLON_CACHING_TIMEOUT)
        Config.logger.log_print(f"Holon cache write: {key}")
    except Exception as e:
        Config.logger.log_print(f"Cache write failed for key {key}:\n{e}")


def get(key: str) -> dict:
    """Get a record from the holon_cache database"""

    try:
        value = caches[Config.cache_name].get(key)

        if not value:
            Config.logger.log_print(f"Holon cache miss. key: {key}")
        else:
            value = json.loads(value)

        return value
    except Exception as e:
        Config.logger.log_print(f"Cache read failed for key {key}:\n{e}")


def exists(key: str) -> bool:
    """Check if a record in the holon_cache database exists"""

    if caches[Config.cache_name].get(key):
        return True

    return False


def clear_scenario(scenario_id: int):
    """Remove all records of a specific scenario in the holon cache"""

    Config.logger.log_print(f"Deleting cache records for scenario with id {scenario_id}")

    caches[Config.cache_name].clear_scenario(scenario_id)


def clear_all():
    """Remove all records in the holon cache"""

    Config.logger.log_print(f"Deleting all cache records")

    caches[Config.cache_name].clear_all()
