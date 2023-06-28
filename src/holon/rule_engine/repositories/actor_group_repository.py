from holon.models import ActorGroup
from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class ActorGroupRepository(RepositoryBaseClass):
    """Repository containing all actors in memory"""

    base_model_type = ActorGroup

    @classmethod
    def from_scenario(cls, scenario: Scenario):
        raise NotImplementedError("Actor groups are shared by all scenarios")

    @classmethod
    def full(cls):
        """Load all ActorGroups: rule actions can assign actors to groups which aren't in the base scenario"""
        return cls(list(ActorGroup.objects.all()))
