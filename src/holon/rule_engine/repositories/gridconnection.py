from holon.models import GridConnection


class GridConnectionRepository:
    """Repository containing all gridconnections in memory"""

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.objects: list[GridConnection] = GridConnection.objects.filter(
            payload=scenario_aggregate.scenario
        ).get_real_instances()
