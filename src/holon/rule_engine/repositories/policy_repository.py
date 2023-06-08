from __future__ import annotations
from typing import TYPE_CHECKING

from .repository_base import RepositoryBaseClass

if TYPE_CHECKING:
    from holon.models import Policy, Scenario


class PolicyRepository(RepositoryBaseClass):
    """Repository containing all policies in memory"""

    objects: list[Policy] = []

    def __init__(self, scenario: Scenario):
        self.objects = Policy.objects.filter(payload=scenario).get_real_instances()
