from holon.models import GridNode
from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class GridNodeRepository(RepositoryBaseClass):
    """Repository containing all gridnodes in memory"""

    base_model_type = GridNode

    @classmethod
    def from_scenario(cls, scenario: Scenario):
        return cls(GridNode.objects.filter(payload=scenario).get_real_instances())
