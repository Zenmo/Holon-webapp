import unittest

from holon.models import GridNode, EnergyAsset
from holon.rule_engine.repositories import GridNodeRepository, EnergyAssetRepository
from django.test import TestCase


class RepositoryFilterRelationTestClass(unittest.TestCase):
    def setUp(self) -> None:
        super().setUp()

        low_gridnode = GridNode()
        low_gridnode.capacity_kw = 2
        low_gridnode.id = 33
        high_gridnode = GridNode()
        high_gridnode.capacity_kw = 4
        high_gridnode.id = 52
        self.gridnode_repository = GridNodeRepository([low_gridnode, high_gridnode])

        low_energy_asset = EnergyAsset()
        low_energy_asset.id = 10
        low_energy_asset.gridnode = low_gridnode
        setattr(low_energy_asset, "gridnode_id", low_gridnode.id)

        high_energy_asset_1 = EnergyAsset()
        high_energy_asset_1.id = 1
        high_energy_asset_1.gridnode = high_gridnode
        setattr(high_energy_asset_1, "gridnode_id", high_gridnode.id)

        high_energy_asset_2 = EnergyAsset()
        high_energy_asset_2.id = 2

        self.asset_repository = EnergyAssetRepository(
            [low_energy_asset, high_energy_asset_1, high_energy_asset_2]
        )

    def test_filter_relation_no_invert(self):

        filtered_repository = self.asset_repository.filter_has_relation(
            "gridnode", self.gridnode_repository, False
        )

        assert filtered_repository.len() == 2
        assert filtered_repository.all()[0].id == 10
        assert filtered_repository.all()[1].id == 1

    def test_filter_relation_invert(self):

        filtered_repository = self.asset_repository.filter_has_relation(
            "gridnode", self.gridnode_repository, True
        )

        assert filtered_repository.len() == 1
        assert filtered_repository.all()[0].id == 2
