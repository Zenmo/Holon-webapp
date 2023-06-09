from holon.models import Contract
from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class ContractRepository(RepositoryBaseClass):
    """Repository containing all contracts in memory"""

    base_model_type = Contract
