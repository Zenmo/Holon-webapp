from datetime import datetime
import json
import traceback

from django.apps import apps
from rest_framework import generics, status
from rest_framework.request import Request
from rest_framework.response import Response
import django_filters.rest_framework

from holon.models import Scenario, rule_mapping
from holon.models.scenario_rule import ModelType
from holon.models.util import all_subclasses, is_exclude_field
from holon.serializers import HolonRequestSerializer, ScenarioSerializer
from holon.services import CostTables, ETMConnect
from holon.services.cloudclient import CloudClient
from holon.services.data import Results
from holon.cache import holon_endpoint_cache
from holon.utils.logging import HolonLogger


class HolonV2Service(generics.CreateAPIView):
    logger = HolonLogger("holon-endpoint")
    serializer_class = HolonRequestSerializer

    def post(self, request: Request):
        serializer = HolonRequestSerializer(data=request.data)
        use_caching = request.query_params.get("caching", "true").lower() == "true"

        scenario = None
        cc = None

        try:
            if serializer.is_valid():
                data = serializer.validated_data

                if use_caching:
                    cache_key = holon_endpoint_cache.generate_key(
                        data["scenario"], data["interactive_elements"]
                    )
                    value = holon_endpoint_cache.get(cache_key)

                    if value:
                        HolonV2Service.logger.log_print(f"HOLON cache hit on: {cache_key}")
                        return Response(
                            value,
                            status=status.HTTP_200_OK,
                        )

                HolonV2Service.logger.log_print(f"Cloning scenario {data['scenario'].id}")
                scenario = rule_mapping.get_scenario_and_apply_rules(
                    data["scenario"].id, data["interactive_elements"]
                )

                HolonV2Service.logger.log_print("Running Anylogic model")
                original_scenario = Scenario.objects.get(id=data["scenario"].id)
                cc = CloudClient(scenario=scenario, original_scenario=original_scenario)
                cc.run()

                HolonV2Service.logger.log_print("Running ETM module")
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

                HolonV2Service.logger.log_print("Calculating CostTables")
                try:
                    cost_benefit_tables = CostTables.from_al_output(
                        cc.outputs["contracts"], scenario
                    )
                except KeyError:
                    HolonV2Service.logger.log_print(
                        "Contract data is not mapped, trying to find the correct output..."
                    )
                    found = False
                    for cc_key, alternative_output in cc._outputs_raw.items():
                        if "contract" in cc_key:
                            found = True
                            HolonV2Service.logger.log_print("Contract found")
                            cost_benefit_tables = CostTables.from_al_output(
                                json.loads(alternative_output), scenario
                            )
                            break
                    if not found:
                        raise KeyError("No contract found in cc keys")

                results = Results(
                    scenario=scenario,
                    request=request,
                    anylogic_outcomes=cc.outputs,
                    cost_benefit_overview=cost_benefit_tables.main_table(),
                    cost_benefit_detail=cost_benefit_tables.all_detailed_tables(),
                    **etm_outcomes,
                )

                HolonV2Service.logger.log_print("200 OK")

                result = results.to_dict()

                if use_caching:
                    holon_endpoint_cache.set(cache_key, result)

                return Response(
                    result,
                    status=status.HTTP_200_OK,
                )

            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            HolonV2Service.logger.log_print(traceback.format_exc())

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
                HolonV2Service.logger.log_print(
                    f"Something went wrong while trying to delete scenario {scenario_id}"
                )
                print(traceback.format_exc())


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

    logger = HolonLogger("holon-scenario-cleanup")

    def get(self, request):
        cloned_scenarios = Scenario.objects.filter(cloned_from__isnull=False)
        try:
            for scenario in cloned_scenarios:
                HolonScenarioCleanup.logger.log_print(f"Deleting scenario {scenario.id}...")
                cid = scenario.id
                scenario.delete()
                HolonScenarioCleanup.logger.log_print(f"... deleted scenario {cid}")
        except Exception as e:
            HolonScenarioCleanup.logger.log_print(traceback.format_exc())
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
