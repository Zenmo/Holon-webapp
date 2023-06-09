from holon.models import Policy
from holon.models.scenario import Scenario
from .repository_base import RepositoryBaseClass


class PolicyRepository(RepositoryBaseClass):
    """Repository containing all policies in memory"""

    base_model_type = Policy

    def __init__(self, scenario: Scenario):
        self.objects = Policy.objects.filter(payload=scenario).get_real_instances()
