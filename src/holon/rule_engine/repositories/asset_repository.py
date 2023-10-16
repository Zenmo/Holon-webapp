from holon.models.scenario import EnergyAsset, Scenario
from django.db.models import Q
from .repository_base import RepositoryBaseClass


class EnergyAssetRepository(RepositoryBaseClass):
    """Repository containing all energyassets in memory"""

    base_model_type = EnergyAsset

    @classmethod
    def from_scenario(cls, scenario: Scenario):
        return cls(
            EnergyAsset.objects.filter(
                Q(gridconnection__payload=scenario) | Q(gridnode__payload=scenario)
            ).get_real_instances()
        )
