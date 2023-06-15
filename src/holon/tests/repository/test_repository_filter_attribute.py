import unittest

from holon.models import (
    GridConnection,
    UtilityGridConnection,
    HeatStorageAsset,
    AttributeFilterComparator,
)
from holon.rule_engine.repositories import GridConnectionRepository


class RepositoryFilterAttributeTestClass(unittest.TestCase):
    def test_filter(self):
        low_grid_connection = GridConnection(id=1)
        low_grid_connection.capacity_kw = 2
        high_grid_connection = GridConnection(id=2)
        high_grid_connection.capacity_kw = 4
        repository = GridConnectionRepository([low_grid_connection, high_grid_connection])

        assert (
            repository.filter_attribute_value(
                "capacity_kw", AttributeFilterComparator.EQUAL, 2
            ).len()
            == 1
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", AttributeFilterComparator.EQUAL, 3
            ).len()
            == 0
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", AttributeFilterComparator.LESS_THAN, 3
            ).len()
            == 1
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", AttributeFilterComparator.LESS_THAN, 5
            ).len()
            == 2
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", AttributeFilterComparator.LESS_THAN, 1
            ).len()
            == 0
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", AttributeFilterComparator.GREATER_THAN, 3
            ).len()
            == 1
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", AttributeFilterComparator.GREATER_THAN, 1
            ).len()
            == 2
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", AttributeFilterComparator.GREATER_THAN, 5
            ).len()
            == 0
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", AttributeFilterComparator.NOT_EQUAL, 3
            ).len()
            == 2
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", AttributeFilterComparator.NOT_EQUAL, 4
            ).len()
            == 1
        )

        # should be kw instead of w
        self.assertRaises(
            Exception,
            repository.filter_attribute_value,
            "capacity_w",
            AttributeFilterComparator.GREATER_THAN,
            9000,
        )

        # should be int instead of string
        self.assertRaises(
            Exception,
            repository.filter_attribute_value,
            "capacity_kw",
            AttributeFilterComparator.GREATER_THAN,
            "9000",
        )
