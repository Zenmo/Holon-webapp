from holon.models import Contract


class ContractRepository:
    """Repository containing all contracts in memory"""

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.objects: list[Contract] = Contract.objects.filter(
            actor__payload=scenario_aggregate.scenario
        ).get_real_instances()
