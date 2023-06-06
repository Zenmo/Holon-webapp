from holon.models import GridNode
from .repository import RepositoryBaseClass


class GridNodeRepository(RepositoryBaseClass):
    """Repository containing all gridnodes in memory"""

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.set_objects(
            GridNode.objects.filter(payload=scenario_aggregate.scenario).get_real_instances()
        )
