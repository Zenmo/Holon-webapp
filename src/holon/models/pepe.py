import json
from cloudclient import Payload

from .factor import Factor
from holon.services.anylogic_datamodel_mvp import payload


class Pepe:
    def __init__(self) -> None:
        pass

    @property
    def preprocessor(self):
        return self._preprocessor

    @preprocessor.setter
    def preprocessor(self, data):
        self._preprocessor = PreProcessor(data)

    @preprocessor.getter
    def preprocessor(self):
        try:
            return self._preprocessor
        #  :-)
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


class EmptyProcessor:
    """Some defaults not to make it all crash"""

    def __init__(self) -> None:
        self.assets = []
        self.holon_payload = payload
        self.gridconnections = []
        self.holon_output = {}


class PreProcessor:
    def __init__(self, data) -> None:
        self.assets = data.get("interactive_elements")
        self.holon_payload = data
        self.grid_connections = data

    # Time to rape some properties!

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
                factor.value = (factor.max_value + factor.min_value) * (
                    interactive_input["value"] / 100
                )

            converted_assets.append(factor)

        self._assets = converted_assets

    @property
    def holon_payload(self) -> Payload:
        """The thing that goes into anylogic as JSON. Is a cloudclient.Payload"""
        return self._holon_payload

    @holon_payload.setter
    def holon_payload(self, data):
        """TODO: inject data into the payload. Make sure to use deepcopy COPY COPY"""
        # meh meh
        self._holon_payload = payload

    @property
    def grid_connections(self):
        return self._grid_connections

    @grid_connections.setter
    def grid_connections(self, data):
        """TODO: Process me with some data! Make sure to make a COPY of the payload from the config"""
        self._grid_connections = [json.loads(gridcon.json()) for gridcon in payload.gridconnections]

    def slider_settings(self):
        """TODO: convert self.assets to some nice sliders ettings to flow into upscaling"""
        DUMMY = 1

        return {
            "share_of_buildings_with_solar_panels": DUMMY,
            "share_of_electric_trucks": DUMMY,
            "grid_battery_on_off": DUMMY,
        }


class PostProcessor:
    def __init__(self, holon_output) -> None:
        self.holon_output = holon_output

    def costs_holon_output(self):
        """TODO: retrun outputs sed for costs"""
        return self.holon_output

    def etm_kpi_holon_output(self):
        """TODO: return etm kpi relevant holon output"""
        return self.holon_output

    def holon_kpis(self):
        """TODO: retrun the HOLON KPI's"""
        return self.holon_output

    def co2_calculation(self):
        """
        TODO: SystemHourlyElectricityImport_MWh (AL) *
        hourly_co2_emissions_of_electricity_production (ETM)
        """
        return 0
