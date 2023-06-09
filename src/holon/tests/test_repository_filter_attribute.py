import unittest

from holon.models import (
    GridConnection,
    UtilityGridConnection,
    HeatStorageAsset,
    AttributeFilterComparator,
)
from holon.rule_engine.repositories import RepositoryBaseClass


class RepositoryFilterAttributeTestClass(unittest.TestCase):
    def test_filter(self):
        low_grid_connection = GridConnection()
        low_grid_connection.capacity_kw = 2
        high_grid_connection = GridConnection()
        high_grid_connection.capacity_kw = 4
        repository = RepositoryBaseClass([low_grid_connection, high_grid_connection])

        assert (
            repository.filter_attribute_value(
                "capacity_kw", 2, AttributeFilterComparator.EQUAL
            ).len()
            == 1
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", 3, AttributeFilterComparator.EQUAL
            ).len()
            == 0
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", 3, AttributeFilterComparator.LESS_THAN
            ).len()
            == 1
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", 5, AttributeFilterComparator.LESS_THAN
            ).len()
            == 2
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", 1, AttributeFilterComparator.LESS_THAN
            ).len()
            == 0
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", 3, AttributeFilterComparator.GREATER_THAN
            ).len()
            == 1
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", 1, AttributeFilterComparator.GREATER_THAN
            ).len()
            == 2
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", 5, AttributeFilterComparator.GREATER_THAN
            ).len()
            == 0
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", 3, AttributeFilterComparator.NOT_EQUAL
            ).len()
            == 2
        )

        assert (
            repository.filter_attribute_value(
                "capacity_kw", 4, AttributeFilterComparator.NOT_EQUAL
            ).len()
            == 1
        )

        # should be kw instead of w
        self.assertRaises(
            Exception,
            repository.filter_attribute_value,
            "capacity_w",
            9000,
            AttributeFilterComparator.GREATER_THAN,
        )

        # should be int instead of string
        self.assertRaises(
            Exception,
            repository.filter_attribute_value,
            "capacity_kw",
            "9000",
            AttributeFilterComparator.GREATER_THAN,
        )
