import unittest

from holon.models import GridConnection, EnergyAsset
from holon.rule_engine.repositories import GridConnectionRepository


class RepositoryGetTestClass(unittest.TestCase):
    def setUp(self) -> None:
        super().setUp()

        low_grid_connection = GridConnection(id=1)
        low_grid_connection.capacity_kw = 2

        high_grid_connection = GridConnection(id=2)
        high_grid_connection.capacity_kw = 4
        self.repository = GridConnectionRepository([low_grid_connection, high_grid_connection])

    def test_add(self):
        assert self.repository.len() == 2

        # add new item
        medium_grid_connection = GridConnection(id=3)
        medium_grid_connection.capacity_kw = 3
        self.repository.add(medium_grid_connection)

        # assert
        assert self.repository.len() == 3
        assert self.repository.objects[2].capacity_kw == 3

    def test_add_wrong_object_type(self):
        energy_asset = EnergyAsset(id=1)

        # non-existing index
        self.assertRaises(
            ValueError,
            self.repository.add,
            energy_asset,
        )

    def test_add_mutable(self):
        assert self.repository.len() == 2

        # add new item
        medium_grid_connection = GridConnection()
        medium_grid_connection.capacity_kw = 3
        self.repository.add(medium_grid_connection)
        self.repository.add(medium_grid_connection)

        # assert
        assert self.repository.len() == 4
        assert self.repository.objects[2].capacity_kw == 3
        assert self.repository.objects[3].capacity_kw == 3

        assert self.repository.objects[2].id != self.repository.objects[3].id

        self.repository.objects[2].capacity_kw = 8

        assert self.repository.objects[2].capacity_kw == 8
        assert self.repository.objects[3].capacity_kw == 3
