from django.apps import apps
from rest_framework import generics, status
from rest_framework.response import Response

from holon.models import rule_mapping
from holon.models.scenario_rule import ModelType

from holon.serializers import HolonRequestSerializer
from holon.models.util import all_subclasses

RESULTS = [
    "SystemHourlyElectricityImport_MWh",
    "APIOutputTotalCostData",
    "totalEHGVHourlyChargingProfile_kWh",
]


class HolonService(generics.CreateAPIView):
    serializer_class = HolonRequestSerializer

    def post(self, request):
        serializer = HolonRequestSerializer(data=request.data)

        return Response(
            "This endpoint is no longer in use, upgrade to the new endpoint!",
            status=status.HTTP_418_IM_A_TEAPOT,
        )


class HolonV2Service(generics.CreateAPIView):
    serializer_class = HolonRequestSerializer

    def post(self, request):
        serializer = HolonRequestSerializer(data=request.data)

        try:
            if serializer.is_valid():
                data = serializer.validated_data

                scenario = rule_mapping.get_scenario_and_apply_rules(
                    data["scenario"].id, data["interactive_elements"]
                )

                # TODO serialize and send to anylogic

                # Delete duplicated scenario
                scenario.delete()

                return Response(
                    "success",
                    status=status.HTTP_200_OK,
                )

            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(f"Something went wrong: {e}", status=status.HTTP_400_BAD_REQUEST)


class HolonCMSLogic(generics.RetrieveAPIView):
    def get(self, request):
        response = {}
        for model in ModelType.choices:
            model_name = model[0]
            model_type_class = apps.get_model("holon", model_name)
            response[model_name] = {
                "attributes": [field.name for field in model_type_class()._meta.get_fields()],
                "model_subtype": {},
            }

            for subclass in all_subclasses(model_type_class):
                response[model_name]["model_subtype"][subclass.__name__] = [
                    field.name for field in subclass()._meta.get_fields()
                ]

        return Response(response)
