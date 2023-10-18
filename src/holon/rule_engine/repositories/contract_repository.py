from holon.models.scenario import Contract
from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class ContractRepository(RepositoryBaseClass):
    """Repository containing all contracts in memory"""

    base_model_type = Contract

    @classmethod
    def from_scenario(cls, scenario: Scenario):
        return cls(Contract.objects.filter(actor__payload=scenario).get_real_instances())
