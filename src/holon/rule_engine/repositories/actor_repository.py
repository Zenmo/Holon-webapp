from holon.models import Actor
from .base_repository import RepositoryBaseClass


class ActorRepository(RepositoryBaseClass):
    """Repository containing all actors in memory"""

    objects: list[Actor] = []

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.set_objects(
            Actor.objects.filter(payload=scenario_aggregate.scenario).get_real_instances()
        )
