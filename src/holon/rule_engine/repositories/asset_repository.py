from holon.models import EnergyAsset
from django.db.models import Q
from .repository_base import RepositoryBaseClass


class EnergyAssetRepository(RepositoryBaseClass):
    """Repository containing all energyassets in memory"""

    objects: list[EnergyAsset] = []

    def __init__(self, scenario: Scenario):
        self.objects = EnergyAsset.objects.filter(
            Q(gridconnection__payload=scenario) | Q(gridnode__payload=scenario)
        ).get_real_instances()
