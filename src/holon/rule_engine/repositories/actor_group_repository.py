from holon.models import ActorGroup
from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class ActorGroupRepository(RepositoryBaseClass):
    """Repository containing all actors in memory"""

    base_model_type = ActorGroup

    @classmethod
    def from_scenario(cls, scenario: Scenario):
        return cls(list(ActorGroup.objects.filter(actor__payload=scenario).distinct()))
