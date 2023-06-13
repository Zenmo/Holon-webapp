from holon.models import Actor
from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class ActorRepository(RepositoryBaseClass):
    """Repository containing all actors in memory"""

    base_model_type = Actor