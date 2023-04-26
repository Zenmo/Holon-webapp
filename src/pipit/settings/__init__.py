from __future__ import absolute_import, unicode_literals

import os
from typing import Optional, Dict, Any

from django.core.exceptions import ImproperlyConfigured
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration


def get_env(name, default=None):
    """Get the environment variable or return exception"""
    if name in os.environ:
        return os.environ[name]

    if default is not None:
        return default

    error_msg = "Set the {} env variable".format(name)
    raise ImproperlyConfigured(error_msg)


def get_env_bool(name, default=None):
    return get_env(name, default=default) == "True"


def initialize_sentry(ingest_dsn: str, environment: str) -> None:
    if ingest_dsn == "":
        return

    sentry_sdk.init(
        dsn=ingest_dsn,
        environment=environment,
        debug=False,
        traces_sample_rate=1.0,
        integrations=[
            DjangoIntegration(
                # Nothing interesting here
                middleware_spans=False,
                # Wagtail produces a lot of signals
                signals_spans=False,
            )
        ],
        release="0.1.0",
        # We do too many queries on some pages.
        # Is there a better way to reduce the number of spans?
        _experiments={"max_spans": 5000},  # default 1000
        before_send_transaction=remove_db_spans,
    )


# Some actions produce many database queries. This exceeds the span limit of Sentry (1000).
# This function removes those spans so there is enough room left to send more relevant data.
def remove_db_spans(event: Dict[str, Any], hint: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    event["spans"] = [span for span in event["spans"] if span["op"] != "db"]

    return event
