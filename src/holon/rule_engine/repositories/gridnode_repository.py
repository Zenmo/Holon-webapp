from holon.models.scenario import GridNode
from .repository_base import RepositoryBaseClass


class GridNodeRepository(RepositoryBaseClass):
    """Repository containing all gridnodes in memory"""

    base_model_type = GridNode
