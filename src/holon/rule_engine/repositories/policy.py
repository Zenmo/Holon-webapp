from holon.models import Policy


class PolicyRepository:
    """Repository containing all policies in memory"""

    def __init__(self, scenario_aggregate):
        self.scenario_aggregate = scenario_aggregate

        self.objects: list[Policy] = Policy.objects.filter(
            payload=scenario_aggregate.scenario
        ).get_real_instances()
