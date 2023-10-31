import unittest

from holon.models.scenario import GridConnection, ChargingMode
from holon.rule_engine.repositories import GridConnectionRepository, RepositoryBaseClass


class RepositoryAddTestClass(unittest.TestCase):
    def test_distinct(self):
        repository = RepositoryBaseClass(
            [
                GridConnection(id=1, capacity_kw=1000, charging_mode=ChargingMode.CHEAP),
                GridConnection(id=2, capacity_kw=1000, charging_mode=ChargingMode.CHEAP),
                GridConnection(id=3, capacity_kw=1000, charging_mode=ChargingMode.SIMPLE),
            ]
        )

        distinct_combinations = repository.get_distinct_attribute_values(
            ["capacity_kw", "charging_mode"]
        )

        expected = [
            {
                "capacity_kw": 1000,
                "charging_mode": ChargingMode.CHEAP,
            },
            {
                "capacity_kw": 1000,
                "charging_mode": ChargingMode.SIMPLE,
            },
        ]

        expected.sort(key=lambda x: (x["capacity_kw"], x["charging_mode"]))
        distinct_combinations.sort(key=lambda x: (x["capacity_kw"], x["charging_mode"]))

        assert len(distinct_combinations) == 2
        self.assertEqual(expected, distinct_combinations)
