import json
import traceback

from django.apps import apps
from django.shortcuts import render
from etm_service.etm_session.session import ETMConnectionError
from rest_framework import generics, status
from rest_framework.request import Request
from rest_framework.response import Response
from sentry_sdk import capture_exception

from holon.cache import holon_endpoint_cache
from holon.models import Scenario, rule_mapping
from holon.models.scenario_rule import ModelType
from holon.models.util import all_subclasses, is_exclude_field
from holon.serializers import HolonRequestSerializer, ScenarioSerializer
from holon.services import CostTables, ETMConnect
from holon.services.cloudclient import CloudClient
from holon.services.data import Results
from holon.utils.logging import HolonLogger
from src.holon.rule_engine.scenario_aggregate import ScenarioAggregate

USE_NEW_SCENARIO_SERIALIZER = False


class HolonV2Service(generics.CreateAPIView):
    logger = HolonLogger("holon-endpoint")
    serializer_class = HolonRequestSerializer

    def post(self, request: Request):
        serializer = HolonRequestSerializer(data=request.data)
        use_caching = request.query_params.get("caching", "true").lower() == "true"

        scenario: Scenario = None
        scenario_to_delete: Scenario = None
        cc = None

        try:
            if serializer.is_valid():
                data = serializer.validated_data
                scenario = data["scenario"]

                if use_caching:
                    cache_key = holon_endpoint_cache.generate_key(
                        scenario, data["interactive_elements"]
                    )
                    value = holon_endpoint_cache.get(cache_key)

                    if value:
                        HolonV2Service.logger.log_print(f"HOLON cache hit on: {cache_key}")
                        return Response(
                            value,
                            status=status.HTTP_200_OK,
                        )

                # APPLY INTERACTIVE ELEMENTs
                HolonV2Service.logger.log_print("Applying interactive elements to scenario")

                if not USE_NEW_SCENARIO_SERIALIZER:
                    scenario = data["scenario"]
                    interactive_elements = data["interactive_elements"]

                    scenario_aggregate = ScenarioAggregate(scenario)
                    scenario_aggregate.apply_rules(interactive_elements)

                    cc_payload = scenario_aggregate.serialize_to_json()
                    cc = CloudClient(payload=cc_payload, original_scenario=scenario)
                else:  # TODO remove after rule engine update

                    original_scenario = scenario

                    HolonV2Service.logger.log_print(f"Cloning scenario {data['scenario'].id}")
                    scenario = rule_mapping.apply_rules(scenario, data["interactive_elements"])

                    # prefetch again after rules are applied, for more efficient serialization
                    scenario = Scenario.queryset_with_relations().get(id=scenario.id)
                    scenario_to_delete = scenario
                    cc = CloudClient(scenario=scenario, original_scenario=original_scenario)

                # RUN ANYLOGIC
                HolonV2Service.logger.log_print("Running Anylogic model")

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
        except (Exception, ETMConnectionError) as e:
            HolonV2Service.logger.log_print(e)
            traceback.print_exc()
            capture_exception(e)

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
                if scenario_to_delete:
                    scenario_id = scenario_to_delete.id
                    scenario_to_delete.delete_async()
            except Exception as e:
                HolonV2Service.logger.log_print(
                    f"Something went wrong while trying to delete scenario {scenario_id}"
                )
                print(traceback.format_exc())


class HolonCacheCheck(generics.CreateAPIView):
    logger = HolonLogger("holon-cache-check")
    serializer_class = HolonRequestSerializer

    def post(self, request: Request):
        serializer = HolonRequestSerializer(data=request.data)

        try:
            if serializer.is_valid():
                data = serializer.validated_data
                cache_key = holon_endpoint_cache.generate_key(
                    data["scenario"], data["interactive_elements"]
                )
                key_exists = holon_endpoint_cache.exists(cache_key)

                return Response(
                    key_exists,
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                key_exists,
                status=status.HTTP_400_BAD_REQUEST,
            )


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


def holonCMSLogicFormatter(request):
    configs = HolonCMSLogic().get(request)
    return render(request, "modelconfig.html", {"configs": configs.data})


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
