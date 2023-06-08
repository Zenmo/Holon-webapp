from holon.models import Contract
from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class ContractRepository(RepositoryBaseClass):
    """Repository containing all contracts in memory"""

    objects: list[Contract] = []

    def __init__(self, scenario: Scenario):
        self.objects = Contract.objects.filter(actor__payload=scenario).get_real_instances()
