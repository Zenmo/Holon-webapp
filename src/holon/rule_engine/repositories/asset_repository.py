from holon.models import EnergyAsset
from django.db.models import Q
from .base_repository import RepositoryBaseClass


class EnergyAssetRepository(RepositoryBaseClass):
    """Repository containing all energyassets in memory"""

    objects: list[EnergyAsset] = []

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.set_objects(
            EnergyAsset.objects.filter(
                Q(gridconnection__payload=scenario_aggregate.scenario)
                | Q(gridnode__payload=scenario_aggregate.scenario)
            ).get_real_instances()
        )
