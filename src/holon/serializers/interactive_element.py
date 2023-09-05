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
    interactive_element = serializers.PrimaryKeyRelatedField(
        queryset=InteractiveElement.objects.all()
    )
    value = serializers.CharField(max_length=255)

    def create(self, validated_data):
        return InteractiveElementInput(**validated_data)

    class Meta:
        fields = ["interactive_element"]
        depth = 1


class HolonRequestSerializer(serializers.Serializer):
    interactive_elements = InteractiveElementInputSerializer(many=True)

    scenario = serializers.IntegerField(min_value=1)

    def create_interactive_elements(self) -> list[InteractiveElementInput]:
        """
        There is probably a built-in way to do this, but I couldn't find it.
        """
        self.is_valid(raise_exception=True)

        return self.fields["interactive_elements"].create(
            self.validated_data["interactive_elements"]
        )

    class Meta:
        fields = ["interactive_elements"]
