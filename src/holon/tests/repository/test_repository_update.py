import unittest

from holon.models import GridConnection, EnergyAsset
from holon.rule_engine.repositories import GridConnectionRepository

from copy import deepcopy


class RepositoryUpdateTestClass(unittest.TestCase):
    def setUp(self) -> None:
        super().setUp()

        low_grid_connection = GridConnection()
        low_grid_connection.capacity_kw = 2
        low_grid_connection.id = 33
        high_grid_connection = GridConnection()
        high_grid_connection.capacity_kw = 4
        high_grid_connection.id = 52
        self.repository = GridConnectionRepository([low_grid_connection, high_grid_connection])

    def test_update(self):
        object_to_update = deepcopy(self.repository.all()[0])
        object_to_update.capacity_kw = 3

        assert self.repository.all()[0].capacity_kw == 2
        self.repository.update(object_to_update)
        assert self.repository.all()[0].capacity_kw == 3

    def test_update_wrong_object_type(self):
        wrong_object = EnergyAsset()
        wrong_object.id = 33

        # non-existing index
        self.assertRaises(
            ValueError,
            self.repository.update,
            wrong_object,
        )

    def test_update_wrong_id(self):
        non_existent_object = GridConnection()
        non_existent_object.capacity_kw = 3
        non_existent_object.id = 12

        # non-existing index
        self.assertRaises(
            KeyError,
            self.repository.update,
            non_existent_object,
        )
