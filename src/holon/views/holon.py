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
from holon.models import Scenario
from holon.rule_engine import rule_mapping
from holon.models.config import QueryCovertModuleType
from holon.models.scenario_rule import ModelType
from holon.models.util import all_subclasses, is_exclude_field
from holon.serializers import HolonRequestSerializer, ScenarioSerializer
from holon.services import CostTables, ETMConnect
from holon.services.cloudclient import CloudClient
from holon.services.data import Results
from holon.utils.logging import HolonLogger
from holon.rule_engine.scenario_aggregate import ScenarioAggregate


def use_result_cache(request: Request) -> bool:
    """
    Caching simulation results is enabled by default unless cookie or query param is set.
    Set cookie in javascript console:
    document.cookie = "caching=false; Path=/; SameSite=none; domain=holontool.nl; secure"
    """
    if request.query_params.get("caching", "true").lower() == "false":
        return False

    if request.COOKIES.get("caching", "true").lower() == "false":
        return False

    return True


class HolonV2Service(generics.CreateAPIView):
    logger = HolonLogger("holon-endpoint")
    serializer_class = HolonRequestSerializer

    def post(self, request: Request):
        serializer = HolonRequestSerializer(data=request.data)

        use_caching = use_result_cache(request)
        scenario = None
        cc = None

        try:
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            data = serializer.validated_data
            scenario_id = data["scenario"]
            interactive_elements = serializer.create_interactive_elements()

            if use_caching:
                cache_key = holon_endpoint_cache.generate_key(scenario_id, interactive_elements)

                value = holon_endpoint_cache.get(cache_key)

                if value:
                    HolonV2Service.logger.log_print(f"HOLON cache hit on: {cache_key}")
                    return Response(
                        value,
                        status=status.HTTP_200_OK,
                    )

            # RULE ENGINE - APPLY INTERACTIVE ELEMENTS
            HolonV2Service.logger.log_print("Applying interactive elements to scenario")

            scenario = Scenario.queryset_with_relations().get(id=scenario_id)

            scenario_aggregate = ScenarioAggregate(scenario)
            scenario_aggregate = rule_mapping.apply_rules(scenario_aggregate, interactive_elements)

            cc_payload = scenario_aggregate.serialize_to_json()
            cc = CloudClient(payload=cc_payload, scenario=scenario)

            # RUN ANYLOGIC
            HolonV2Service.logger.log_print("Running Anylogic model")

            cc.run()

            # ETM MODULE
            HolonV2Service.logger.log_print("Running ETM module")
            etm_outcomes = self._etm_results(scenario, scenario_aggregate, cc)

            HolonV2Service.logger.log_print("Calculating CostTables")
            cost_benefit_tables = self._cost_benefit_tables(
                etm_outcomes.pop("depreciation_costs"), scenario_aggregate, cc
            )

            results = Results(
                cc_payload=cc_payload,
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

    def _etm_results(
        self, scenario: Scenario, scenario_aggregate: ScenarioAggregate, cc: CloudClient
    ):
        """Returns a dict with results from the ETM"""
        etm_outcomes = {
            "cost_outcome": None,
            "nat_upscaling_outcomes": None,
            "inter_upscaling_outcomes": None,
            "depreciation_costs": [],
        }
        for module, outcome in ETMConnect.connect_from_scenario(
            scenario, scenario_aggregate, cc.outputs
        ):
            if module == QueryCovertModuleType.COST:
                etm_outcomes["cost_outcome"] = outcome
            elif module == QueryCovertModuleType.UPSCALING:
                etm_outcomes["nat_upscaling_outcomes"] = outcome
            elif module == QueryCovertModuleType.UPSCALING_REGIONAL:
                etm_outcomes["inter_upscaling_outcomes"] = outcome
            elif module == QueryCovertModuleType.COSTBENEFIT:
                etm_outcomes["depreciation_costs"] = outcome
            else:
                raise Exception(f"Unknow ETM module {module}")

        return etm_outcomes

    def _cost_benefit_tables(
        self, depreciation_costs, scenario_aggregate: ScenarioAggregate, cc: CloudClient
    ) -> CostTables:
        tables = CostTables.from_al_output(self._find_contracts(cc), scenario_aggregate)
        for costs in depreciation_costs:
            tables.inject_depreciation_costs(costs)
        return tables

    def _find_contracts(self, cc: CloudClient):
        """Finds contracts in the AnyLogic outcomes, needed for cost tables"""
        try:
            return cc.outputs["contracts"]
        except KeyError as err:
            HolonV2Service.logger.log_print(
                "Contract data is not mapped, trying to find the correct output..."
            )
            for cc_key, alternative_output in cc._outputs_raw.items():
                if "contract" in cc_key:
                    return json.loads(alternative_output)
            raise KeyError("No contract found in cc keys") from err


class HolonCacheCheck(generics.CreateAPIView):
    logger = HolonLogger("holon-cache-check")
    serializer_class = HolonRequestSerializer

    def post(self, request: Request):
        if not use_result_cache(request):
            # This gives the right experience in the frontend
            return Response(
                {"is_cached": False},
                status=status.HTTP_200_OK,
            )

        serializer = HolonRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        cache_key = holon_endpoint_cache.generate_key(
            data["scenario"], serializer.create_interactive_elements()
        )
        key_exists = holon_endpoint_cache.exists(cache_key)

        return Response(
            {"is_cached": key_exists},
            status=status.HTTP_200_OK,
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
