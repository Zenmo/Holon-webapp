import dataclasses
import json
from collections.abc import Iterable
from typing import Any
from anylogiccloudclient.client.single_run_outputs import SingleRunOutputs
from holon.models import AnylogicCloudOutput


@dataclasses.dataclass
class AnyLogicOutput:
    """
    Wraps AnyLogic output
    """

    # As returned by AnyLogic's CloudClient
    source: SingleRunOutputs

    # Keys mapped to internal keys (mapping is configured in CMS)
    # and JSON strings decoded
    decoded: dict[str, Any]

    # TODO: get rid of this
    _outputs_raw: dict[str, Any]

    @classmethod
    def from_source(cls, source: SingleRunOutputs, key_mappings: Iterable[AnylogicCloudOutput]):
        decoded = {
            key_mapping.internal_key: json.loads(source.value(key_mapping.anylogic_key))
            for key_mapping in key_mappings
        }

        _outputs_raw = {name: source.value(name) for name in source.names()}

        return cls(source=source, decoded=decoded, _outputs_raw=_outputs_raw)

    def get_key_over_all_results(self, key: str) -> float:
        value = 1
        for subdict in self.decoded.values():
            try:
                value = subdict[0][key]  # TODO why is this like this? Seems like jackson artefact
            except KeyError:
                pass
        return value

    def create_dict(self, keys: list[str]) -> dict:
        return {key: self.get_key_over_all_results(key) for key in keys}
