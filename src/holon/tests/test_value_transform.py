from django.test import TestCase
from holon.models.scenario_rule import ModelType, ScenarioRule

from holon.models.value_tranform import *


class ValueTransformTestClass(TestCase):
    def test_value_translate_positive(self):
        """Test ValueTranslate with a positive number"""

        # Arrange
        rule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
        )

        value_translate = ValueTranslate(amount=3)
        value = 4

        # Assert
        new_value = value_translate.transform_value(value)

        self.assertEqual(new_value, 7)

    def test_value_sca(self):
        """Test ValueTranslate with a negate number"""

        # Arrange
        rule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
        )

        value_translate = ValueTranslate(amount=-3)
        value = 4

        # Assert
        new_value = value_translate.transform_value(value)

        self.assertEqual(new_value, 1)

    def test_value_scale(self):
        """Test ValueScale"""

        # Arrange
        rule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
        )

        value_scale = ValueScale(factor=3)
        value = 2

        # Assert
        new_value = value_scale.transform_value(value)

        self.assertEqual(new_value, 6)

    def test_value_map_range(self):
        """Test ValueMapRange"""

        # Arrange
        rule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
        )

        value_map_range = ValueMapRange(value_min=1, value_max=7, new_range_min=5, new_range_max=15)

        # Assert
        value = 1
        new_value = value_map_range.transform_value(value)
        self.assertEqual(new_value, 5)

        value = 7
        new_value = value_map_range.transform_value(value)
        self.assertEqual(new_value, 15)

        value = 4
        new_value = value_map_range.transform_value(value)
        self.assertEqual(new_value, 10)

    def test_value_round(self):
        """Test ValueRound with round mode"""

        # Arrange
        rule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
        )

        value_round = ValueRound(mode=RoundMode.ROUND)

        # Assert
        value = 1.6
        new_value = value_round.transform_value(value)
        self.assertEqual(new_value, 2)

    def test_value_floor(self):
        """Test ValueRound with floor mode"""

        # Arrange
        rule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
        )

        value_round = ValueRound(mode=RoundMode.FLOOR)

        # Assert
        value = 1.6
        new_value = value_round.transform_value(value)
        self.assertEqual(new_value, 1)

    def test_value_ceil(self):
        """Test ValueRound with round mode"""

        # Arrange
        rule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
        )

        value_round = ValueRound(mode=RoundMode.CEIL)

        # Assert
        value = 1.4
        new_value = value_round.transform_value(value)
        self.assertEqual(new_value, 2)
