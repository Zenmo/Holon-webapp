from holon.models import ActorSubGroup
from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class ActorSubGroupRepository(RepositoryBaseClass):
    """Repository containing all actors in memory"""

    base_model_type = ActorSubGroup

    @classmethod
    def from_scenario(cls, scenario: Scenario):
        return cls(list(ActorSubGroup.objects.filter(actor__payload=scenario)))
