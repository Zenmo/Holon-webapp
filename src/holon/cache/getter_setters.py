from django.core.cache import caches
import json
from django.conf import settings


def set(key: str, result: dict) -> None:
    result = json.dumps(result)
    caches["holon_cache"].set(key, result, timeout=settings.HOLON_CACHING_TIMEOUT)
    print("Holon cache write: ", key, result)


def get(key: str) -> dict:

    value = caches["holon_cache"].get(key)

    if not value:
        print("HOLON cache miss. key:", key)
    else:
        value = json.loads(value)

    return value
