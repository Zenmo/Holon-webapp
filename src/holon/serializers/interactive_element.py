from typing import Iterable

from rest_framework import serializers

from holon.models.interactive_element import InteractiveElement
from holon.models.scenario import Scenario


class InteractiveElementInput:
    def __init__(self, interactive_element: InteractiveElement, value: str):
        self.interactive_element = interactive_element
        self.value = str(value)

    def hash(self):
        return self.interactive_element.hash() + self.value


def hash_collection(inputs: Iterable[InteractiveElementInput]):
    return "".join([input.hash() for input in inputs])


class InteractiveElementInputSerializer(serializers.Serializer):
    interactive_element = serializers.IntegerField(min_value=1)
    value = serializers.CharField(max_length=255)

    def create(self, validated_data):
        return InteractiveElementInput(**validated_data)

    class Meta:
        fields = ["interactive_element"]
        depth = 1


class HolonRequestSerializer(serializers.Serializer):
    scenario = serializers.IntegerField(min_value=1)

    interactive_elements = InteractiveElementInputSerializer(many=True)

    def create_interactive_elements(self) -> list[InteractiveElementInput]:
        """
        Some custom code to prevent N+1 queries which we would have if we used
        serializers.PrimaryKeyRelatedField for the interactive elements.
        """
        self.is_valid(raise_exception=True)

        interactive_elements_ids = {
            iae["interactive_element"] for iae in self.validated_data["interactive_elements"]
        }
        interactive_elements = list(
            InteractiveElement.objects
            # Tried to reduce the number of queries when calculating the cache key.
            # Unfortunately the prefetched data doesn't properly stick to the objects so it makes it worse.
            # .prefetch_related("options")
            # .prefetch_related("continuous_values__rules__attribute_filters")
            # .prefetch_related("continuous_values__rules__relation_attribute_filters")
            # .prefetch_related("continuous_values__rules__second_order_relation_attribute_filters")
            # .prefetch_related("continuous_values__rules__relation_exists_filters")
            # .prefetch_related("continuous_values__rules__discrete_attribute_filters")
            # .prefetch_related("continuous_values__rules__continuous_factors")
            # .prefetch_related("continuous_values__rules__discrete_factors_change_attribute")
            # .prefetch_related("continuous_values__rules__discrete_factors_attribute_noise")
            # .prefetch_related("continuous_values__rules__discrete_factors_add")
            # .prefetch_related("continuous_values__rules__discrete_factors_remove")
            # .prefetch_related("continuous_values__rules__discrete_factors_set_count")
            # .prefetch_related("continuous_values__rules__discrete_factors_add_multiple_under_each_parent")
            # .prefetch_related("continuous_values__rules__subselector_skips")
            # .prefetch_related("continuous_values__rules__subselector_takes")
            .filter(pk__in=interactive_elements_ids)
        )

        if len(interactive_elements) != len(interactive_elements_ids):
            raise serializers.ValidationError("One or more interactive element ids are invalid.")

        interactive_elements_by_id = {iae.id: iae for iae in interactive_elements}

        # We need to preserve the order of the interactive elements
        return [
            InteractiveElementInput(
                interactive_elements_by_id[iae["interactive_element"]], iae["value"]
            )
            for iae in self.validated_data["interactive_elements"]
        ]

    class Meta:
        fields = ["interactive_elements"]
