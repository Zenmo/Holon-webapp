import unittest

from holon.models import (
    HouseGridConnection,
    BuiltEnvironmentGridConnection,
    UtilityGridConnection,
    HeatStorageAsset,
)
from holon.rule_engine.repositories import GridConnectionRepository


class RepositoryFilterSubmodelTestClass(unittest.TestCase):
    def test_filter(self):
        # Pick gridconnection because it also a clusterable model, thus using multiple inheritance
        house_grid_connection = HouseGridConnection(id=1)
        repository = GridConnectionRepository([house_grid_connection])

        built_environment_repository = repository.filter_model_subtype(
            BuiltEnvironmentGridConnection
        )
        assert len(built_environment_repository.all()) == 1

        utility_repository = repository.filter_model_subtype(UtilityGridConnection)
        assert len(utility_repository.all()) == 0

        # HeatStorageAsset does not belong to the same model hierarchy as GridConnection
        self.assertRaises(Exception, repository.filter_model_subtype, HeatStorageAsset)
