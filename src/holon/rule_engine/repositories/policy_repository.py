from holon.models.scenario import Policy
from .repository_base import RepositoryBaseClass


class PolicyRepository(RepositoryBaseClass):
    """Repository containing all policies in memory"""

    base_model_type = Policy
