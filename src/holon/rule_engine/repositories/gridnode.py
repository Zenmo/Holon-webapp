from holon.models import GridNode


class GridNodeRepository:
    """Repository containing all gridnodes in memory"""

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.objects: list[GridNode] = GridNode.objects.filter(
            payload=scenario_aggregate.scenario
        ).get_real_instances()
