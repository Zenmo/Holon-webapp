from holon.models import GridNode
from src.holon.models.scenario import Scenario
from .base_repository import RepositoryBaseClass


class GridNodeRepository(RepositoryBaseClass):
    """Repository containing all gridnodes in memory"""

    objects: list[GridNode] = []

    def __init__(self, scenario: Scenario):
        self.objects = GridNode.objects.filter(payload=scenario).get_real_instances()
