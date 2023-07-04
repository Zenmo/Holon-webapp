from django.test import TestCase

from holon.models import InteractiveElement, ChoiceType, InteractiveElementContinuousValues


class CacheTestClass(TestCase):
    def test_possible_values_have_fractions(self):
        interactive_element = InteractiveElement()
        interactive_element.type = ChoiceType.CHOICE_CONTINUOUS
        interactive_element.continuous_values.add(
            InteractiveElementContinuousValues(
                slider_value_min=0,
                slider_value_max=50,
                discretization_steps=5,
            )
        )

        possible_values = interactive_element.get_possible_values()
        expected = ["0", "12.5", "25", "37.5", "50"]

        assert possible_values == expected
