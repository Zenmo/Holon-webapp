import json
from hashlib import sha256
import pkg_resources

from holon.models.scenario import Scenario


def generate_key(scenario: Scenario, interactive_inputs, prefix=""):
    """Generate a unique cache key for the scenario data and interactive inputs configuration"""

    input_hash = sha256(str(interactive_inputs).encode("utf-8")).hexdigest()
    cms_configuration_hash = scenario.hash()
    etm_hash = pkg_resources.get_distribution("etm_service").version
    # anylogic_hash = pkg_resources.get_distribution("anylogiccloudclient").version # TODO WERKT NIET MET ANYLOGIC WANT ANYLOGIC (altijd 8.5.0)

    hashed_key = f"{prefix}{cms_configuration_hash}_{input_hash}_{etm_hash}"  # _{anylogic_hash}"

    return hashed_key
