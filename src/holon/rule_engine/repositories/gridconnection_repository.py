from holon.models import GridConnection
from .repository import RepositoryBaseClass


class GridConnectionRepository(RepositoryBaseClass):
    """Repository containing all gridconnections in memory"""

    objects: list[GridConnection] = []

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.set_objects(
            GridConnection.objects.filter(payload=scenario_aggregate.scenario).get_real_instances()
        )
