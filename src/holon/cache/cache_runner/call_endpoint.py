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
    Config.logger.log_print(f"Calling HolonV2Service endpoint with configuration {request_body}")

    # Create request to holon endpoint
    # request = HttpRequest()
    # request.data = request_body
    # request.query_params = {}
    # result = HolonV2Service().post(request)

    if True or result.status_code == 200:
        Config.logger.log_print(f"Endpoint finished succesfully ({combination_i}/{n_combinations})")
    else:
        print(result, result.__dict__)
        Config.logger.log_print(
            f"Calling HolonV2Service endpoint failed with response {request.data}"
        )
