from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class ScenarioRepository(RepositoryBaseClass):
    """Repository containing all contracts in memory"""

    base_model_type = Scenario

    @classmethod
    def from_scenario(cls, scenario: Scenario):
        return cls([scenario])
