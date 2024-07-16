import json
from typing import Any

from anylogiccloudclient.client.cloud_client import Inputs


def inputs_to_debug_values(inputs: Inputs) -> dict:
    """
    Do some heuristics to parse values.
    These values should never be used directly, only for debugging
    """
    return {name: try_get_input(inputs, name) for name in inputs.names()}


def try_get_input(inputs: Inputs, name: str) -> Any:
    # get_input() sometimes throws an error
    # So we deal with the raw value
    result = inputs._input_by_name(name)["value"]

    if type(result) is not str:
        return result

    try:
        return json.loads(result)
    except json.decoder.JSONDecodeError:
        return result
