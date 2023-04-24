import json
from hashlib import sha256
import pkg_resources


def generate_key(scenario, interactive_inputs, prefix=""):
    input_hash = sha256(json.dumps(interactive_inputs).encode("utf-8")).hexdigest()
    cms_configuration_hash = scenario.hash()
    etm_hash = pkg_resources.get_distribution("etm_service").version
    anylogic_hash = pkg_resources.get_distribution("anylogiccloudclient").version

    hashed_key = f"{prefix}{cms_configuration_hash}_{input_hash}_{etm_hash}_{anylogic_hash}"

    return hashed_key
