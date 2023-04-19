import traceback

from django.apps import apps
from rest_framework import generics, status
from rest_framework.request import Request
from rest_framework.response import Response

from holon.models import Scenario, rule_mapping
from holon.models.scenario_rule import ModelType
from holon.models.util import all_subclasses, is_exclude_field
from holon.serializers import HolonRequestSerializer, ScenarioSerializer
from holon.services import CostBenedict, ETMConnect
from holon.services.cloudclient import CloudClient
from holon.services.data import Results

DUMMY_UPSCALE = {"sustainability": 42, "self_sufficiency": 42, "netload": 42, "costs": 42}
DUMMY_COST = 42

from .dummies import costbenefit_result_json, dashboard_result_json


def pprint(msg: str):
    return print(f"[holon-endpoint]: {msg}")


class HolonV2Service(generics.CreateAPIView):
    serializer_class = HolonRequestSerializer

    def post(self, request: Request):
        serializer = HolonRequestSerializer(data=request.data)

        scenario = None
        cc = None

        try:
            if serializer.is_valid():
                data = serializer.validated_data

                pprint(f"Cloning scenario {data['scenario'].id}")
                scenario = rule_mapping.get_scenario_and_apply_rules(
                    data["scenario"].id, data["interactive_elements"]
                )

                pprint("Running Anylogic model")
                original_scenario = Scenario.objects.get(id=data["scenario"].id)
                cc = CloudClient(scenario=scenario, original_scenario=original_scenario)
                cc.run()

                pprint("Running ETM module")
                # TODO: is this the way to distinguish the national and inter results?
                # Init with none values so Result always has the keys
                etm_outcomes = {
                    "cost_outcome": None,
                    "nat_upscaling_outcomes": None,
                    "inter_upscaling_outcomes": None,
                }
                for name, outcome in ETMConnect.connect_from_scenario(
                    original_scenario, scenario, cc.outputs
                ):
                    if name == "cost":
                        etm_outcomes["cost_outcome"] = outcome
                    elif name == "National upscaling":
                        etm_outcomes["nat_upscaling_outcomes"] = outcome
                    elif name == "Regional upscaling":
                        etm_outcomes["inter_upscaling_outcomes"] = outcome

                pprint("Running CostBenedict module")
                # ignore me! (TODO: should only be triggered on bedrijventerrein)
                cost_benefit_results = CostBenedict(
                    actors=cc.outputs["actors"]
                ).determine_group_costs()

                results = Results(
                    scenario=scenario,
                    request=request,
                    anylogic_outcomes=cc.outputs,
                    cost_benefit_detail=cost_benefit_results,  # TODO: twice the same!
                    cost_benefit_overview=cost_benefit_results,  # TODO: twice the same!
                    **etm_outcomes,
                )

                pprint("200 OK")
                return Response(
                    results.to_dict(),
                    status=status.HTTP_200_OK,
                )

            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            pprint(traceback.format_exc())

            response_body = {"error_msg": f"something went wrong: {e}"}
            if scenario:
                response_body["scenario"] = ScenarioSerializer(scenario).data
            if cc:
                response_body["anylogic_outcomes"] = cc.outputs

            return Response(
                response_body,
                status=status.HTTP_400_BAD_REQUEST,
            )
        finally:
            # always delete the scenario!
            try:
                if scenario:
                    scenario_id = scenario.id
                    scenario.delete_async()
            except Exception as e:
                pprint(f"Something went wrong while trying to delete scenario {scenario_id}")
                pprint(traceback.format_exc())


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
            if is_exclude_field(field):
                continue
            attribute = {"name": field.name}
            if field.is_relation and issubclass(field.related_model, tuple(self.valid_relations)):
                attribute["relation"] = field.related_model.__name__
            attributes.append(attribute)
        return attributes


class HolonScenarioCleanup(generics.RetrieveAPIView):
    def get(self, request):
        cloned_scenarios = Scenario.objects.filter(cloned_from__isnull=False)
        try:
            for scenario in cloned_scenarios:
                pprint(f"Deleting scenario {scenario.id}...")
                cid = scenario.id
                scenario.delete()
                pprint(f"... deleted scenario {cid}")
        except Exception as e:
            pprint(traceback.format_exc())
            response_body = {"error_msg": f"something went wrong: {e}"}
            return Response(
                response_body,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response("succes")


class HolonService(generics.CreateAPIView):
    def post(self, request):
        return Response(
            "This endpoint is no longer in use, upgrade to the new endpoin!",
            status=status.HTTP_410_GONE,
        )
