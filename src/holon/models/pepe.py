import json
from pathlib import Path
from typing import List

import etm_service
from cloudclient.datamodel.contracts import Contract, ContractTypeEnum, ContractScopeEnum
from cloudclient.datamodel.actors import ActorTypeEnum
from cloudclient.datamodel.gridconnections import ChargingModeEnum, BatteryModeEnum

from api.models.interactive_input import InteractiveInput
from holon.anylogic_kpi import calculate_holon_kpis
from holon.economic.im_sorry import calculate_total_costs

from .util import write_payload_to_jsons
from .factor import Factor

ETM_CONFIG_PATH = Path(__file__).resolve().parents[1] / "services"
ETM_CONFIG_FILE_GET_KPIS = "etm_kpis.config"
ETM_CONFIG_FILE_COSTS = "etm_costs.config"
ETM_CONFIG_FILE_SCALING = "etm_scaling.config"
COSTS_SCENARIO_ID = 2166341  # KEV + 1 MW grid battery | ETM sceanrio on beta
WRITE_TO_JSON = False  # controls the write to json at policy level


class Pepe:
    def __init__(self) -> None:
        pass

    @property
    def preprocessor(self):
        return self._preprocessor

    @preprocessor.setter  # S: this one I like
    def preprocessor(self, data):
        self._preprocessor = PreProcessor(data)

    @preprocessor.getter
    def preprocessor(self):
        try:
            return self._preprocessor
        #  :-) big ooffff
        except:
            return EmptyProcessor()

    @property
    def postprocessor(self):
        return self._postprocessor

    @postprocessor.setter
    def postprocessor(self, results_and_payload_tuple):
        holon_results, holon_payload = results_and_payload_tuple
        self._postprocessor = PostProcessor(holon_results, holon_payload)

    @postprocessor.getter
    def postprocessor(self):
        try:
            return self._postprocessor
        #  :-)
        except:
            return EmptyProcessor()

    def upscale_to_etm(self):
        """Postprocessing step"""
        if self.preprocessor.is_valid() and self.postprocessor.is_valid():
            self.preprocessor.etm_scenario_id = etm_service.scale_copy_and_send(
                self.preprocessor.etm_scenario_id,
                self.preprocessor.etm_slider_settings() | self.postprocessor.etm_kpi_holon_output(),
                ETM_CONFIG_PATH,
                ETM_CONFIG_FILE_SCALING,
            )
            self.postprocessor.etm_results = etm_service.retrieve_results(
                self.preprocessor.etm_scenario_id, ETM_CONFIG_PATH, ETM_CONFIG_FILE_GET_KPIS
            )

    def calculate_costs(self):
        """Postprocessing step"""
        if self.preprocessor.is_valid() and self.postprocessor.is_valid():
            # NOTE: inputs for the costs are queried from a different 'standard' scenario and
            # independent of any HOLON influence. These are an excellent candidate for caching.
            self.postprocessor.total_costs = calculate_total_costs(
                etm_service.retrieve_results(
                    COSTS_SCENARIO_ID, ETM_CONFIG_PATH, ETM_CONFIG_FILE_COSTS
                ),
                self.preprocessor.grid_connections(),
                self.postprocessor.costs_holon_output(),
            )


class EmptyProcessor:
    """Some defaults not to make it all crash"""

    def __init__(self) -> None:
        self.assets = []
        self.holon_output = {}

    def is_valid(self):
        return False

    def results(self):
        return {}


class PreProcessor:
    def __init__(self, data) -> None:
        self.etm_scenario_id = data.get("scenario").get("etm_scenario_id")
        self.assets = data.get("interactive_elements")
        self.interactive_elements = data.get("interactive_elements")
        self.holon_payload = data
        self.policies = self.extract_policies_from_interactive_input()

    def is_valid(self):
        # TODO!
        return True

    # Time to misuse some properties!

    @property
    def assets(self):
        return self._assets

    @assets.setter
    def assets(self, data):
        converted_assets = []
        factors = Factor.objects.all()
        for factor in factors:
            interactive_input = next(
                (
                    item
                    for item in data
                    if item["interactive_element"].asset_type_id == factor.asset_id
                ),
                None,
            )
            if interactive_input is not None:
                factor.value = (factor.max_value - factor.min_value) * (
                    float(interactive_input["value"])
                    / 100  # TODO: cast here to float, but bro should that not just be a float?
                ) + factor.min_value

                converted_assets.append(factor)

        self._assets = converted_assets

    def extract_policies_from_interactive_input(self) -> dict:
        """
        TODO: asumes that all user values that are strings (cannot be parsed to floats) should be parsed here
        """
        policies = {}
        for user_input in self.interactive_elements:
            interactive_el: InteractiveInput = user_input["interactive_element"]
            input_value: float | str = user_input["value"]

            try:
                float(input_value)
            except ValueError:
                policies.update({interactive_el.name: input_value})

        return policies

    def apply_charging_policies(
        self,
        charging_mode: str = None,
        battery_mode: str = None,
        apply_to_connections: list = ["LOGISTICS", "GRIDBATTERY"],
    ) -> None:
        """lil bit more DRY still cry"""
        gcs = self.holon_payload["gridconnections"]
        for gc in gcs:

            try:
                gc_type = gc["type"]
            except KeyError:
                gc_type = gc["category"]

            if gc_type in apply_to_connections:
                if charging_mode is not None:
                    gc["charging_mode"] = charging_mode
                if battery_mode is not None:
                    gc["battery_mode"] = battery_mode

    def apply_contracts(self, actor_category: str, contracts: List[Contract]) -> None:
        """lil bit more DRY still cry"""
        actors = self.holon_payload["actors"]
        for actor in actors:
            if actor["category"] == actor_category:
                actor["contracts"] = [json.loads(contract.json()) for contract in contracts]

    def toggle_battery_location(self, remove_location: str) -> None:

        grid_connections = self.holon_payload["gridconnections"]

        for gc in grid_connections:
            try:
                gc_type = gc["type"]
            except KeyError:
                gc_type = gc["category"]

            if gc_type == remove_location:
                for i, asset in enumerate(gc["assets"]):
                    if asset["type"] == "STORAGE_ELECTRIC":
                        _ = gc["assets"].pop(i)

                        print(f"[toggle_battery_location]: removing STORAGE_ELECTRIC at {gc_type}")

    def apply_policies(self) -> None:
        """
        Minimal modularity, seperate the hacky cheese from the fondue
        TODO: assumes that bools ("true" or "false") only apply to smart charging or not
        TODO: Loads of hardcoded stuff now
        TODO: Verify whether it works like this, should implement non-firm ato in a different way I suppose
        """

        def pprint(message: str) -> None:
            print(f"[apply_policies]: {message}")

        for key, value in self.policies.items():
            # battery charging mode
            if value == "false":
                pprint("Match at smart charging: false")
                self.apply_charging_policies(
                    charging_mode=ChargingModeEnum.max_power.value,
                )

            elif value == "true":
                pprint("Match at smart charging: true")
                self.apply_charging_policies(
                    charging_mode=ChargingModeEnum.max_spread.value,
                )

            # current policy
            elif value == "current":
                pprint("Match at default: current")

                # remove battery from gridbattery (no dupes)
                self.toggle_battery_location(remove_location="GRIDBATTERY")

                self.apply_charging_policies(
                    battery_mode=BatteryModeEnum.balance.value,
                )

                # Apply nodal pricing and variable price at an individual level
                self.apply_contracts(
                    actor_category=ActorTypeEnum.connectionowner.value,
                    contracts=[
                        Contract(
                            type=ContractTypeEnum.fixed.value,
                            contract_scope=ContractScopeEnum.energysupplier.value,
                        ),
                    ],
                )
                # Explicitly no contracts at the holon level
                self.apply_contracts(
                    actor_category=ActorTypeEnum.energyholon.value,
                    contracts=[],
                )
                if WRITE_TO_JSON:  # TODO: Remove this line once everything is up and running
                    write_payload_to_jsons(payload_dict=self.holon_payload, name=value)
            # financiacial individual
            elif value == "dayahead_gopacs_individual":
                pprint("Match at finacial: dayahead_gopacs_individual")

                # remove battery from gridbattery (no dupes)
                self.toggle_battery_location(remove_location="GRIDBATTERY")

                self.apply_charging_policies(
                    battery_mode=BatteryModeEnum.price.value,
                )

                # Apply nodal pricing and variable price at an individual level
                self.apply_contracts(
                    actor_category=ActorTypeEnum.connectionowner.value,
                    contracts=[
                        Contract(
                            type=ContractTypeEnum.nodalpricing.value,
                            contract_scope=ContractScopeEnum.gridoperator.value,
                        ),
                        Contract(
                            type=ContractTypeEnum.variable.value,
                            contract_scope=ContractScopeEnum.energysupplier.value,
                        ),
                    ],
                )
                # Explicitly no contracts at the holon level
                self.apply_contracts(
                    actor_category=ActorTypeEnum.energyholon.value,
                    contracts=[],
                )
                if WRITE_TO_JSON:  # TODO: Remove this line once everything is up and running
                    write_payload_to_jsons(payload_dict=self.holon_payload, name=value)

            # financial collective
            elif value == "dayahead_gopacs_collective":
                pprint("Match at finacial: dayahead_gopacs_collective")

                # remove battery from gridbattery (no dupes)
                self.toggle_battery_location(remove_location="LOGISTICS")

                self.apply_charging_policies(
                    battery_mode=BatteryModeEnum.price.value,
                )

                # Apply default pricing irt energyholon and variable price at an individual level
                self.apply_contracts(
                    actor_category=ActorTypeEnum.connectionowner.value,
                    contracts=[
                        Contract(
                            type=ContractTypeEnum.default.value,
                            contract_scope=ContractScopeEnum.energyholon.value,
                        ),
                    ],
                )

                # Apply a nodal pricing contract to the gridoperator at energy holon level
                self.apply_contracts(
                    actor_category=ActorTypeEnum.energyholon.value,
                    contracts=[
                        Contract(
                            type=ContractTypeEnum.nodalpricing.value,
                            contract_scope=ContractScopeEnum.gridoperator.value,
                        ),
                        Contract(
                            type=ContractTypeEnum.variable.value,
                            contract_scope=ContractScopeEnum.energysupplier.value,
                        ),
                    ],
                )
                if WRITE_TO_JSON:  # TODO: Remove this line once everything is up and running
                    write_payload_to_jsons(payload_dict=self.holon_payload, name=value)

            # contract individual
            elif value == "nf_ato_individual":
                pprint("Match at contract: nf_ato_individual")

                # remove battery from gridbattery (no dupes)
                self.toggle_battery_location(remove_location="GRIDBATTERY")

                self.apply_charging_policies(
                    battery_mode=BatteryModeEnum.balance.value,
                )

                # Apply nonfirm contract at an individual level and default pricing at individual level
                self.apply_contracts(
                    actor_category=ActorTypeEnum.connectionowner.value,
                    contracts=[
                        Contract(
                            type=ContractTypeEnum.nonfirm.value,
                            contract_scope=ContractScopeEnum.gridoperator.value,
                        ),
                        Contract(
                            type=ContractTypeEnum.fixed.value,
                            contract_scope=ContractScopeEnum.energysupplier.value,
                        ),
                    ],
                )
                # Explicitly no contracts at the holon level
                self.apply_contracts(
                    actor_category=ActorTypeEnum.energyholon.value,
                    contracts=[],
                )
                if WRITE_TO_JSON:  # TODO: Remove this line once everything is up and running
                    write_payload_to_jsons(payload_dict=self.holon_payload, name=value)

            # contract collective
            elif value == "nf_ato_collective":
                pprint("Match at contract: nf_ato_collective")

                # remove battery from gridbattery (no dupes)
                self.toggle_battery_location(remove_location="LOGISTICS")
                self.apply_charging_policies(
                    battery_mode=BatteryModeEnum.balance.value,
                )

                # Apply default pricing irt energyholon and default price at an individual level
                self.apply_contracts(
                    actor_category=ActorTypeEnum.connectionowner.value,
                    contracts=[
                        Contract(
                            type=ContractTypeEnum.default.value,
                            contract_scope=ContractScopeEnum.energyholon.value,
                        ),
                    ],
                )

                # Apply a nonfirm contract to the gridoperator at energy holon level
                self.apply_contracts(
                    actor_category=ActorTypeEnum.energyholon.value,
                    contracts=[
                        Contract(
                            type=ContractTypeEnum.nonfirm.value,
                            contract_scope=ContractScopeEnum.gridoperator.value,
                        ),
                        Contract(
                            type=ContractTypeEnum.fixed.value,
                            contract_scope=ContractScopeEnum.energysupplier.value,
                        ),
                    ],
                )
                if WRITE_TO_JSON:  # TODO: Remove this line once everything is up and running
                    write_payload_to_jsons(payload_dict=self.holon_payload, name=value)

                # catch the unknowns
                else:
                    raise ValueError(
                        f"The value that was supplied ('{value}') as a policy was not known!"
                    )

    def apply_interactive_to_payload(self):
        """
        TODO: cry many tears for this function, poor pepe #pepelivesmatter

        >>> Unsure what the factor object will contain for single selects and multi selects
        >>> Parse policies
        >>> Balance diesel and EV's

        TODO: For balancing diesel and electric trucks this assumes many _identical_ E trucks against 1 diesel truck assets (scaled).
        TODO: Balancing assumes the diesel and electric trucks to always be part of the same grid connection.
        TODO: Balancing may set the "vehicleScaling" attribute to 0, does AL know how to handle this?
        TODO: Balancing should round the output because the data model specificies an int, fck. We should change that.
        TODO: do smtng with recursive shit that is smarter than this junk
        TODO: every interactive element (that has a factor table) should be included, otherwise this function breaks
        """
        self.apply_policies()
        self.apply_anylogic_asset_scaling()

    def apply_anylogic_asset_scaling(self) -> None:
        def pprint(message: str) -> None:
            print(f"[anylogic_asset_scaling] {message}")

        # ugh
        ev_truck_asset_count = 0
        def_ev_scaling = None

        # For things that only affect assets
        grid_connections = self.holon_payload["gridconnections"]
        for factor in self.assets:
            for gc in grid_connections:

                try:
                    gc_type = gc["type"]
                except KeyError:
                    gc_type = gc["category"]

                if gc_type == factor.grid_connection.type:
                    for asset in gc["assets"]:
                        if asset["type"] == factor.asset.type:

                            def_ev_scaling = (
                                asset[factor.asset_attribute]
                                if factor.asset.type == "ELECTRIC_VEHICLE"
                                else None
                            )
                            ev_truck_asset_count = (
                                ev_truck_asset_count + 1
                                if factor.asset.type == "ELECTRIC_VEHICLE"
                                else ev_truck_asset_count
                            )
                            asset[factor.asset_attribute] = factor.value

                            pprint(
                                f"setting {factor.asset_attribute} to {factor.value} for {factor.asset.type} in {gc_type}"
                            )

                    # >>> DIESEL_TRUCK EGHV balancing
                    if factor.asset.type == "ELECTRIC_VEHICLE":
                        for asset in gc["assets"]:
                            if asset["type"] == "DIESEL_VEHICLE":

                                # oof
                                diesel_truck_count = asset[factor.asset_attribute]
                                ev_truck_count = ev_truck_asset_count * def_ev_scaling
                                total_truck_count = diesel_truck_count + ev_truck_count
                                target_diesel_truck_count = total_truck_count - ev_truck_asset_count * float(
                                    factor.value
                                )  # TODO: This is needed because the wagtail default arg is a string

                                asset[factor.asset_attribute] = target_diesel_truck_count

                                print(
                                    f"|---> balancing by setting {factor.asset_attribute} to {target_diesel_truck_count} for 'DIESEL_VEHICLE' in {gc_type}"
                                )

                                write_payload_to_jsons(self.holon_payload, "latest")

    @property
    def holon_payload(self) -> dict:
        """The thing that goes into anylogic as JSON."""
        return self._holon_payload

    @holon_payload.setter
    def holon_payload(self, value):
        """TODO: inject data into the payload. Make sure to use deepcopy COPY COPY (seth: Noooo, we _want_ a pointer!)"""
        self._holon_payload = value

    def grid_connections(self) -> list[dict]:
        """Returns the grid_connections in list format to be processed by economic modules"""
        return self._holon_payload["gridconnections"]

    def etm_slider_settings(self):
        """
        Raw slider settings from front end to send to ETM -
        TODO: we gaan ervanuit dat _IEDER_
        inetractive element een ETM key heeft. Deze mappen voor slider settings. Dus dit hieronder
        aanpassen etm_key. Zelde loop gebruiken als voor de assets

        S: I've added type hinting here, based on the serializer. Perhaps it would be nice to implement typehinting together with linting
        such that we have more certainty about interfaces?
        """
        sliders = {}
        for user_input in self.interactive_elements:
            interactive_el: InteractiveInput = user_input["interactive_element"]
            input_value: float | str = user_input["value"]

            try:
                sliders.update({interactive_el.etm_key: input_value})
            except AttributeError:
                pass

        return sliders


class PostProcessor:
    def __init__(self, holon_output, holon_payload) -> None:
        self.holon_output = holon_output
        self.holon_payload = holon_payload
        self.etm_results = {}
        self.total_costs = 0

    def is_valid(self):
        # TODO!
        return True

    def costs_holon_output(self) -> list[dict]:
        """Returns outputs used for economic module"""
        return self.holon_output["APIOutputTotalCostData"]

    def etm_kpi_holon_output(self) -> dict:
        """
        Returns the only relevant holon output to be upscaled to ETM,
        if it's missing, returns a flat profile
        """
        # TODO: This resolves to the default option (aka the matrix of ones)

        holon_output = {}
        try:
            holon_output = {
                "totalEHGVHourlyChargingProfile_kWh": self.holon_output[
                    "totalEHGVHourlyChargingProfile_kWh"
                ]
            }
        except KeyError:
            print("pepe.etm_kpi_holon_output: Resolving to empty values for this key!")

        return holon_output

    def holon_kpis(self) -> dict:
        """TODO: return the relevant HOLON KPI's"""
        return self.holon_output

    def co2_calculation(self):
        """Returns the KPI of CO2 TODO: come up with a better function for local co2"""
        import numpy as np

        output = self.holon_output["SystemHourlyElectricityImport_MWh"]
        import_curve = np.array(list(output.values())[:8760])

        co2_curve = np.array(self.etm_results.get("CO2_curve", np.zeros(import_curve.shape)))
        co2_local = np.inner(import_curve, co2_curve)
        sus_percentage = co2_local / import_curve.sum() / 10000 / 1500
        return sus_percentage

    def local_sufficiency_calculation(self):
        """TODO: make a sensible formula for this"""
        imported = self.holon_output["APIOutputTotalCostData"][0]["totalElectricityImport_MWh"]
        exported = self.holon_output["APIOutputTotalCostData"][0]["totalElectricityExport_MWh"]
        return imported / exported

    def local_network_load_calculation(self):
        """TODO: make a sensible formula for this"""

        peakload = self.holon_output["APIOutputTotalCostData"][0]["HSMSPeakLoadElectricity_kW"]

        return peakload / 500_000  # TODO watchout for the hard coded

    def results(self):
        """TODO: pepe geeft de juiste resultaten terug"""

        results = {
            "national": {
                "netload": round(self.etm_results["national_kpi_network_load"], 1),
                "costs": round(self.etm_results["national_total_costs"], -8),  # reduce significance
                # ETM returns factor instead of percentage for sustainability
                "sustainability": round(
                    100 * self.etm_results["national_share_of_renewable_electricity"], 1
                ),
                "self_sufficiency": round(self.etm_results["national_kpi_self_sufficiency"], 1),
            },
            "local": {
                "costs": round(self.total_costs, -3),  # reduce significance
                **calculate_holon_kpis(
                    total_cost_data=self.holon_output["APIOutputTotalCostData"][0],
                    gridnode_config=self.holon_payload["gridnodes"],
                    etm_data=self.etm_results,
                ),
            },
        }

        return results
