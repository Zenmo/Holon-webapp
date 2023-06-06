from holon.models import EnergyAsset
from django.db.models import Q


class EnergyAssetRepository:
    """Repository containing all energyassets in memory"""

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.objects: list[EnergyAsset] = EnergyAsset.objects.filter(
            Q(gridconnection__payload=scenario_aggregate.scenario)
            | Q(gridnode__payload=scenario_aggregate.scenario)
        ).get_real_instances()
