from holon.models import Actor
from src.holon.models.scenario import Scenario
from .base_repository import RepositoryBaseClass


class ActorRepository(RepositoryBaseClass):
    """Repository containing all actors in memory"""

    objects: list[Actor] = []

    def __init__(self, scenario: Scenario):
        objects = Actor.objects.filter(payload=scenario).get_real_instances()

