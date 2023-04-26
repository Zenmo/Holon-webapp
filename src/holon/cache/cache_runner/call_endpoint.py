from typing import Any
from holon.cache.cache_runner.config import Config
from holon.serializers.interactive_element import InteractiveElementInput
from holon.views import HolonV2Service
from django.http import HttpRequest


def call_holon_endpoint(
    scenario_id: int,
    holon_input_configuration: tuple[InteractiveElementInput],
    combination_i: int,
    n_combinations: int,
):

    request_body = {
        "scenario": scenario_id,
        "interactive_elements": [
            {
                "interactive_element": interactive_element_input.interactive_element.id,
                "value": interactive_element_input.value,
            }
            for interactive_element_input in holon_input_configuration
        ],
    }
    printable_request_body = request_body
    Config.logger.log_print(
        f"Calling HolonV2Service endpoint with configuration {get_printable_request_body(request_body)} ({combination_i+1}/{n_combinations})"
    )

    try:
        # Create request to holon endpoint
        request = HttpRequest()
        request.data = request_body
        request.query_params = {}
        result = HolonV2Service().post(request)

    except Exception as e:
        if result.status_code != 200:
            print(result, result.__dict__)
            Config.logger.log_print(
                f"Calling HolonV2Service endpoint failed with response {request.data}:\nError: {e}"
            )
    if result.status_code != 200:
        print(result, result.__dict__)
        Config.logger.log_print(
            f"Calling HolonV2Service endpoint failed with response {request.data}"
        )


def get_printable_request_body(request_body: dict[str, Any]) -> str:
    """Make request body smol"""

    smol_request_body = request_body.copy()

    interactive_elements = [
        {item["interactive_element"]: item["value"]}
        for item in smol_request_body["interactive_elements"]
    ]

    return str({"scenario": request_body["scenario"], "interactive_elements": interactive_elements})
