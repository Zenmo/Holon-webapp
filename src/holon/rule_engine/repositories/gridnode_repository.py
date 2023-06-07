from holon.models import GridNode
from .base_repository import RepositoryBaseClass


class GridNodeRepository(RepositoryBaseClass):
    """Repository containing all gridnodes in memory"""

    objects: list[GridNode] = []

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.set_objects(
            GridNode.objects.filter(payload=scenario_aggregate.scenario).get_real_instances()
        )
