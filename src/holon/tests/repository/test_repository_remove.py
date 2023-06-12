import unittest

from holon.models import GridConnection, EnergyAsset
from holon.rule_engine.repositories import GridConnectionRepository

from copy import deepcopy


class RepositoryRemoveTestClass(unittest.TestCase):
    def setUp(self) -> None:
        super().setUp()

        low_grid_connection = GridConnection()
        low_grid_connection.capacity_kw = 2
        low_grid_connection.id = 33
        high_grid_connection = GridConnection()
        high_grid_connection.capacity_kw = 4
        high_grid_connection.id = 52
        self.repository = GridConnectionRepository([low_grid_connection, high_grid_connection])

    def test_remove(self):

        id_to_remove_0 = self.repository.objects[0].id
        id_to_remove_1 = self.repository.objects[1].id

        assert self.repository.len() == 2
        self.repository.remove(id_to_remove_0)
        assert self.repository.len() == 1
        self.repository.remove(id_to_remove_1)
        assert self.repository.len() == 0

    def test_remove_wrong_id(self):

        # non-existing index
        self.assertRaises(
            ValueError,
            self.repository.remove,
            12,
        )
