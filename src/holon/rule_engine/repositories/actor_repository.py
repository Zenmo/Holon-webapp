from holon.models import Actor
from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class ActorRepository(RepositoryBaseClass):
    """Repository containing all actors in memory"""

    base_model_type = Actor

    def __init__(self, scenario: Scenario):
        self.objects = Actor.objects.filter(payload=scenario).get_real_instances()
