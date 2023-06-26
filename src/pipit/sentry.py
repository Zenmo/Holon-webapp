import logging
import sys
from collections import defaultdict
from datetime import datetime
from functools import wraps
from typing import Callable

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

from pipit.settings import get_env_bool


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
            ),
        ],
        release="0.1.0",
        # We do too many queries on some pages.
        # Is there a better way to reduce the number of spans?
        _experiments={"max_spans": 100_000},  # default 1000
        before_send_transaction=consolidate_db_spans_nothrow,
        traces_sampler=traces_sampler,
    )


# To reduce the number of traces sent to sentry, only send it when the user has set a cookie or query string.
# Set cookie in browser from javascript console:
#     document.cookie = "sentry_tracing=true; Path=/; SameSite=Lax"
def traces_sampler(sampling_context: dict):
    wsgi_environ = sampling_context.get("wsgi_environ")
    if wsgi_environ == None:
        return 0

    query_string = wsgi_environ.get("QUERY_STRING")
    cookie_string = wsgi_environ.get("HTTP_COOKIE")

    if query_string != None and "sentry_tracing=true" in query_string:
        return 1

    if cookie_string != None and "sentry_tracing=true" in cookie_string:
        return 1

    return 0


def consolidate_db_spans_nothrow(event: dict[str, any], hint: dict[str, any]) -> dict[str, any]:
    try:
        return consolidate_db_spans(event, hint)
    # Don't emit exception because it will cause Sentry to not submit the transaction.
    except Exception as e:
        logging.exception("Error consolidating database spans")
        return event


is_old_python = sys.version_info.major <= 3 and sys.version_info.minor < 11


# Some actions produce many database queries. This exceeds the span limit of Sentry (1000).
# This function merges those spans so there is enough room left to send more relevant data.
def consolidate_db_spans(event: dict[str, any], hint: dict[str, any]) -> dict[str, any]:
    new_spans: list[dict[str, any]] = []

    db_events_per_parent_span: dict[str, list[dict[str, any]]] = defaultdict(list)

    for span in event["spans"]:
        if span["op"] != "db":
            new_spans.append(span)
            continue

        db_events_per_parent_span[span["parent_span_id"]].append(span)

    for spans in db_events_per_parent_span.values():
        if len(spans) == 1:
            # This span is the only database query within its parent span.
            # Include this as-is.
            new_spans.append(spans[0])
            continue

        earliest_start_timestamp = spans[0]["start_timestamp"]
        latest_timestamp = spans[0]["timestamp"]
        duration_s = 0.0

        for span in spans:
            earliest_start_timestamp = min(earliest_start_timestamp, span["start_timestamp"])
            latest_timestamp = max(latest_timestamp, span["timestamp"])

            if is_old_python:
                # Python <3.11 does not support "Z" suffix for UTC timestamp
                # even though this is part of the RFC 3339 and ISO 8601 standards.
                t1 = datetime.fromisoformat(span["start_timestamp"].replace("Z", "+00:00"))
                t2 = datetime.fromisoformat(span["timestamp"].replace("Z", "+00:00"))

                duration_s += (t2 - t1).total_seconds()
            else:
                t1 = datetime.fromisoformat(span["start_timestamp"])
                t2 = datetime.fromisoformat(span["timestamp"])

                duration_s += (t2 - t1).total_seconds()

        consolidated_span = {
            "trace_id": spans[0]["trace_id"],
            "span_id": spans[0]["span_id"],
            "parent_span_id": spans[0]["parent_span_id"],
            "same_process_as_parent": True,
            "op": "db",
            "description": f"consolidated span of {len(spans)} database queries",
            "data": {
                "Number of queries": len(spans),
                "Consolidated Duration": f"{round(duration_s * 1000, 2)}ms",
            },
            "start_timestamp": earliest_start_timestamp,
            "timestamp": latest_timestamp,
        }

        new_spans.append(consolidated_span)

    event["spans"] = new_spans

    return event


def sentry_sdk_trace(func: Callable) -> Callable:
    """Decorator that conditionally adds Sentry tracing to a function based on an environment variable."""

    @wraps(func)
    def inner(*args, **kwargs):
        if get_env_bool("CACHE_RUNNER_RUNNING", False):
            return func(*args, **kwargs)
        else:
            return sentry_sdk.trace(func)(*args, **kwargs)

    return inner
