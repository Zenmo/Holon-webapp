import json
from hashlib import sha512
import etm_service
import anylogiccloudclient


def generate_key(scenario, interactive_inputs, prefix=""):
    input_hash = sha512(json.dumps(interactive_inputs).encode("utf-8")).hexdigest()
    cms_configuration_hash = scenario.hash()
    etm_hash = etm_service.__hash__()  # TODO test if hash changes with different versions
    anylogic_hash = (
        anylogiccloudclient.__hash__()
    )  # TODO test if hash changes with different versions

    hashed_key = f"{prefix}{cms_configuration_hash}_{input_hash}_{etm_hash}_{anylogic_hash}"

    return hashed_key
