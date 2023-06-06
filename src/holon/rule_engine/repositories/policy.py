from holon.models import Policy
from .repository import RepositoryBaseClass


class PolicyRepository(RepositoryBaseClass):
    """Repository containing all policies in memory"""

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.set_objects(
            Policy.objects.filter(payload=scenario_aggregate.scenario).get_real_instances()
        )
