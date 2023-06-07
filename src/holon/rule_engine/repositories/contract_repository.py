from holon.models import Contract
from .base_repository import RepositoryBaseClass


class ContractRepository(RepositoryBaseClass):
    """Repository containing all contracts in memory"""

    objects: list[Contract] = []

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.set_objects(
            Contract.objects.filter(actor__payload=scenario_aggregate.scenario).get_real_instances()
        )
