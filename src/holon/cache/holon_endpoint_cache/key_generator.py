from hashlib import sha256
from typing import Iterable

import pkg_resources
import base58

from holon.models.scenario import Scenario
from holon.serializers.interactive_element import InteractiveElementInput, hash_collection


def generate_key(scenario_id: int, interactive_inputs: Iterable[InteractiveElementInput]):
    """
    Generate a unique cache key for the interactive inputs combination.

    The key is dependent on:
    - the configuration of the interactive element in the CMS
    - the submitted values.

    The key is not dependent on:
    - the AnyLogic model version.
    - the Scenario configuration (houses, assets, contracts, etc.)
    """

    input_and_cms_config_hash = base58.b58encode(
        sha256(hash_collection(interactive_inputs).encode("utf-8")).digest()
    ).decode("ascii")

    etm_hash = pkg_resources.get_distribution("etm_service").version

    hashed_key = f"s{scenario_id}_{input_and_cms_config_hash}_{etm_hash}"

    return hashed_key
