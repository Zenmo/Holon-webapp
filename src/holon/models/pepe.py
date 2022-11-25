import json
from pathlib import Path
import etm_service

from .factor import Factor
from holon.economic.im_sorry import calculate_total_costs

ETM_CONFIG_PATH = Path(__file__).resolve().parents[1] / "services"
ETM_CONFIG_FILE_GET_KPIS = "etm_kpis.config"
ETM_CONFIG_FILE_COSTS = "etm_costs.config"
ETM_CONFIG_FILE_SCALING = "etm_scaling.config"
COSTS_SCENARIO_ID = 2166341  # KEV + 1 MW grid battery | ETM sceanrio on beta


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
    def postprocessor(self, holon_results):
        self._postprocessor = PostProcessor(holon_results)

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
                self.preprocessor.slider_settings() | self.postprocessor.etm_kpi_holon_output(),
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
        self.holon_payload = data

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
                    interactive_input["value"] / 100
                ) + factor.min_value

            converted_assets.append(factor)

        self._assets = converted_assets

    def apply_interactive_to_payload(self):
        """TODO: cry many tears for this function, poor pepe"""
        grid_connections = self.holon_payload["gridconnections"]
        for factor in self.assets:
            for gc in grid_connections:
                print(factor.grid_connection.__dict__)

                try:
                    gc_type = gc["type"]
                except KeyError:
                    gc_type = gc["category"]

                if gc_type == factor.grid_connection.type:
                    for asset in gc["assets"]:
                        if asset["type"] == factor.asset.type:
                            asset[factor.asset_attribute] = factor.value

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
        return [json.loads(gridcon.json()) for gridcon in self._holon_payload.gridconnections]

    def slider_settings(self):
        """
        Raw slider settings from front end to send to ETM -
        TODO: we gaan ervanuit dat
        inetractive element een ETM key heeft. Deze mappen voor slider settings. Dus dit hieronder
        aanpassen etm_key. Zelde loop gebruiken als voor de assets
        """
        return {factor.asset.type: factor.value for factor in self.assets}


class PostProcessor:
    def __init__(self, holon_output) -> None:
        self.holon_output = holon_output
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
        return {
            "totalEHGVHourlyChargingProfile_kWh": self.holon_output.get(
                "totalEHGVHourlyChargingProfile_kWh", [1] * 8670
            )
        }

    def holon_kpis(self) -> dict:
        """TODO: return the relevant HOLON KPI's"""
        return self.holon_output

    def co2_calculation(self):
        """Returns the KPI of CO2"""
        return self.holon_output["SystemHourlyElectricityImport_MWh"] * self.etm_results.get(
            "hourly_co2_emissions_of_electricity_production", 0
        )

    def results(self):
        """TODO: pepe geeft de juiste resultaten terug"""
        return (
            self.holon_kpis()
            | self.etm_results
            | {"total_costs": self.total_costs, "co2_kpi": self.co2_calculation()}
        )