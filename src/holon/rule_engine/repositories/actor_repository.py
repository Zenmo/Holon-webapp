from holon.models.scenario import Actor
from .repository_base import RepositoryBaseClass


class ActorRepository(RepositoryBaseClass):
    """Repository containing all actors in memory"""

    base_model_type = Actor
