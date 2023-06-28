import unittest

from holon.models import (
    BuildingGridConnection,
    AttributeFilterComparator,
    InsulationLabel,
)
from holon.rule_engine.repositories import GridConnectionRepository


class RepositoryFilterAttributeTestClass(unittest.TestCase):
    def test_enum_filter(self):
        gridconnection_b = BuildingGridConnection(
            id=1,
            insulation_label=InsulationLabel.B,
        )
        gridconnection_d = BuildingGridConnection(
            id=2,
            insulation_label=InsulationLabel.D,
        )
        gridconnection_none = BuildingGridConnection(
            id=3,
            insulation_label=InsulationLabel.NONE,
        )
        repository = GridConnectionRepository(
            [gridconnection_b, gridconnection_d, gridconnection_none]
        )

        assert (
            repository.filter_enum_attribute_value(
                "insulation_label", AttributeFilterComparator.EQUAL, InsulationLabel.B
            ).len()
            == 1
        )

        assert (
            repository.filter_enum_attribute_value(
                "insulation_label", AttributeFilterComparator.NOT_EQUAL, InsulationLabel.B
            ).len()
            == 2
        )

        assert (
            repository.filter_enum_attribute_value(
                "insulation_label", AttributeFilterComparator.GREATER_THAN, InsulationLabel.E
            ).len()
            == 2
        )

        assert (
            repository.filter_enum_attribute_value(
                "insulation_label", AttributeFilterComparator.LESS_THAN, InsulationLabel.E
            ).len()
            == 0
        )

        assert (
            repository.filter_enum_attribute_value(
                "insulation_label", AttributeFilterComparator.GREATER_THAN, InsulationLabel.C
            ).len()
            == 1
        )

        assert (
            repository.filter_enum_attribute_value(
                "insulation_label", AttributeFilterComparator.LESS_THAN, InsulationLabel.C
            ).len()
            == 1
        )

        assert (
            repository.filter_enum_attribute_value(
                "insulation_label", AttributeFilterComparator.EQUAL, InsulationLabel.NONE
            ).len()
            == 1
        )

        assert (
            repository.filter_enum_attribute_value(
                "insulation_label", AttributeFilterComparator.NOT_EQUAL, InsulationLabel.NONE
            ).len()
            == 2
        )

        assert (
            repository.filter_enum_attribute_value(
                "insulation_label", AttributeFilterComparator.GREATER_THAN, InsulationLabel.NONE
            ).len()
            == 2
        )

        assert (
            repository.filter_enum_attribute_value(
                "insulation_label", AttributeFilterComparator.LESS_THAN, InsulationLabel.NONE
            ).len()
            == 0
        )
