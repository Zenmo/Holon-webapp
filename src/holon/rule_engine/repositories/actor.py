from holon.models import Actor


class ActorRepository:
    """Repository containing all actors in memory"""

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.objects: list[Actor] = Actor.objects.filter(
            payload=scenario_aggregate.scenario
        ).get_real_instances()
