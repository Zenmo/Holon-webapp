from holon.models import ActorSubGroup
from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class ActorSubGroupRepository(RepositoryBaseClass):
    """Repository containing all actors in memory"""

    base_model_type = ActorSubGroup

    @classmethod
    def from_scenario(cls, scenario: Scenario):
        raise NotImplementedError("Actor sub groups are shared by all scenarios")

    @classmethod
    def full(cls):
        """Load all ActorSubGroups: rule actions can assign actors to groups which aren't in the base scenario"""
        return cls(list(ActorSubGroup.objects.all()))
