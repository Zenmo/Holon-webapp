from holon.cache.cache_runner.config import Config
from holon.serializers.interactive_element import InteractiveElementInput


def call_holon_endpoint(holon_input_configuration: tuple[InteractiveElementInput]):

    request_body = str(
        [
            f"{interactive_element_input.interactive_element}: {interactive_element_input.value}"
            for interactive_element_input in holon_input_configuration
        ]
    )
    Config.logger.log_print(f"Calling HolonV2Service endpoint with configuration {request_body}")

    # TODO call endpoint
