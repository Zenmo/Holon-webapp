import unittest

from holon.models import HouseGridConnection
from holon.rule_engine.repositories import GridConnectionRepository


class RepositoryInitTestClass(unittest.TestCase):
    def test_init_original_ids(self):
        gridconnection_1 = HouseGridConnection(id=1)
        gridconnection_2 = HouseGridConnection(id=2)
        repository = GridConnectionRepository([gridconnection_1, gridconnection_2])

        for object in repository.all():
            assert object.original_id is not None
