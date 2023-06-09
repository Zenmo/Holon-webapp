from holon.models import Policy
from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class PolicyRepository(RepositoryBaseClass):
    """Repository containing all policies in memory"""

    base_model_type = Policy

    @classmethod
    def from_scenario(cls, scenario: Scenario):
        return cls(Policy.objects.filter(payload=scenario).get_real_instances())
