from django.apps import apps
from rest_framework import generics, status
from rest_framework.response import Response

from holon.models import rule_mapping, Scenario
from holon.models.scenario_rule import ModelType
from holon.services.cloudclient import CloudClient
from holon.services import CostBenedict
from holon.services.data import Results

from holon.serializers import HolonRequestSerializer
from holon.models.util import all_subclasses

DUMMY_UPSCALE = {"sustainability": 42, "self_sufficiency": 42, "netload": 42, "costs": 42}
DUMMY_COST = 42


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

                # TODO hand over the original_scenario for configs and the edited scenario for datamodel
                original_scenario = Scenario.objects.get(id=data["scenario"].id)
                cc = CloudClient(original_scenario)
                cc.run()

                cost_benefit_results = CostBenedict(
                    actors=cc.outputs["actors"]
                ).determine_group_costs()

                results = Results(
                    scenario=scenario,
                    anylogic_outcomes=cc.outputs,
                    inter_upscaling_outcomes=DUMMY_UPSCALE,
                    nat_upscaling_outcomes=DUMMY_UPSCALE,
                    cost_outcomes=DUMMY_COST,
                    costbenefit_outcomes=cost_benefit_results,
                )

                # Delete duplicated scenario
                scenario.delete()
                return Response(
                    results.to_dict(),
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


class HolonService(generics.CreateAPIView):
    def post(self, request):
        return Response(
            "This endpoint is no longer in use, upgrade to the new endpoin!",
            status=status.HTTP_410_GONE,
        )
