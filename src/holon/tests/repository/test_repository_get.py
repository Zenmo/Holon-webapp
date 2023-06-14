import unittest

from holon.models import GridConnection
from holon.rule_engine.repositories import GridConnectionRepository


class RepositoryGetTestClass(unittest.TestCase):
    def setUp(self) -> None:
        super().setUp()

        low_grid_connection = GridConnection()
        low_grid_connection.capacity_kw = 2
        low_grid_connection.id = 33
        high_grid_connection = GridConnection()
        high_grid_connection.capacity_kw = 4
        high_grid_connection.id = 52
        self.repository = GridConnectionRepository([low_grid_connection, high_grid_connection])

    def test_get(self):
        assert self.repository.get(33).capacity_kw == 2
        assert self.repository.get(52).capacity_kw == 4

    def test_get_wrong_id(self):
        # non-existing index
        self.assertRaises(
            KeyError,
            self.repository.get,
            10,
        )
