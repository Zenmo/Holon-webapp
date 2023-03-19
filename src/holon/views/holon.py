from django.apps import apps
from rest_framework import generics, status
from rest_framework.response import Response

from holon.models import Scenario, rule_mapping
from holon.models.scenario_rule import ModelType
from holon.models.util import all_subclasses
from holon.serializers import HolonRequestSerializer
from holon.services import CostBenedict
from holon.services.cloudclient import CloudClient
from holon.services.data import Results

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

                original_scenario = Scenario.objects.get(id=data["scenario"].id)
                cc = CloudClient(scenario=scenario, original_scenario=original_scenario)
                cc.run()

                cost_benefit_results = CostBenedict(
                    actors=cc.outputs["actors"]
                ).determine_group_costs()

                results = Results(
                    scenario=scenario,
                    anylogic_outcomes=cc.outputs,
                    inter_upscaling_outcomes=DUMMY_UPSCALE,
                    nat_upscaling_outcomes=DUMMY_UPSCALE,
                    cost_outcome=DUMMY_COST,
                    cost_benefit_detail=cost_benefit_results,  # TODO: twice the same!
                    cost_benefit_overview=cost_benefit_results,  # TODO: twice the same!
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
        finally:
            # always delete the scenario!
            try:
                scenario.delete()
            except (
                NameError
            ):  # catch name error if the view crashed before instantiating the scenario
                pass


class HolonCMSLogic(generics.RetrieveAPIView):
    valid_relations = [apps.get_model("holon", model[0]) for model in ModelType.choices]

    def get(self, request):
        response = {}

        for model in ModelType.choices:
            model_name = model[0]
            model_type_class = apps.get_model("holon", model_name)

            attributes = self.get_attributes_and_relations(model_type_class)

            response[model_name] = {
                "attributes": attributes,
                "model_subtype": {},
            }

            for subclass in all_subclasses(model_type_class):
                response[model_name]["model_subtype"][
                    subclass.__name__
                ] = self.get_attributes_and_relations(subclass)

        return Response(response)

    def get_attributes_and_relations(self, model_type_class):
        attributes = []
        for field in model_type_class()._meta.get_fields():
            attribute = {"name": field.name}
            if field.is_relation and issubclass(field.related_model, tuple(self.valid_relations)):
                attribute["relation"] = field.related_model.__name__
            attributes.append(attribute)
        return attributes


class HolonService(generics.CreateAPIView):
    def post(self, request):
        return Response(
            "This endpoint is no longer in use, upgrade to the new endpoin!",
            status=status.HTTP_410_GONE,
        )
