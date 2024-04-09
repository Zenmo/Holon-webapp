from __future__ import absolute_import, unicode_literals

import os

from django.core.exceptions import ImproperlyConfigured


def get_env(name, default=None):
    """Get the environment variable or return exception"""
    if name in os.environ:
        return os.environ[name]

    if default is not None:
        return default

    raise ImproperlyConfigured(f"Set the {name} env variable")


def get_env_int(name: str, default: int = None):
    string_value = os.getenv(name)
    if string_value is None:
        return default

    return int(string_value)


def get_env_bool(name: str, default: bool = None) -> bool:
    if name in os.environ:
        string_value = os.environ[name].upper()

        if string_value == "TRUE":
            return True

        if string_value == "FALSE":
            return False

        error_msg = f"Expected True or False for env variable {name} but got {string_value}"
        raise ImproperlyConfigured(error_msg)

    if default is not None:
        return default

    error_msg = f"Set the {name} env variable"
    raise ImproperlyConfigured(error_msg)
