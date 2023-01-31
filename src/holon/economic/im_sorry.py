"""Fun economic module that should be rebuilt after the MVP :)"""
import numpy as np

# Which ETM queries map to what kind of cost items - these queries should all be present
# in the etm_costs.config.yml
ETM_MAPPING = {
    "depreciation_costs_buildings_solar_panels_per_kw": ("BUILDING", "PHOTOVOLTAIC"),
    "depreciation_costs_households_air_source_heat_pump_per_kw": ("HOUSE", "HEAT_PUMP_AIR"), #TODO: check this key
    "depreciation_costs_households_air_source_hybrid_heat_pump_per_kw": ("HOUSE", "HYBRID_HEAT_PUMP_AIR"), #TODO: check this key
    "depreciation_costs_households_gas_burner_per_kw": ("HOUSE", "GAS_BURNER"), #TODO: check this key
    "depreciation_costs_households_solar_panels_per_kw": ("HOUSE", "PHOTOVOLTAIC"),
    "depreciation_costs_solar_farm_per_kw": ("SOLARFARM", "PHOTOVOLTAIC"),
    "depreciation_costs_wind_farm_inland_per_kw": ("WINDFARM", "INLAND_WIND_TURBINE"),
    "depreciation_costs_buildings_gas_burner_per_kw": ("BUILDING", "GAS_BURNER"),
    "depreciation_costs_industry_solar_panels_per_kw": ("INDUSTRY", "PHOTOVOLTAIC"),
    "depreciation_costs_industry_gas_burner_per_kw": ("INDUSTRY", "GAS_BURNER"),
    "depreciation_costs_industry_electrolyser_per_kw": ("INDUSTRY", "ELECTROLYSER"), #TODO: check this key

    "hourly_price_of_electricity_per_mwh": ("SystemHourlyElectricity", ""),  # TODO: check this key
    "price_of_natural_gas_per_mwh": ("totalMethane", ""),
    "price_of_hydrogen_per_mwh": ("totalHydrogen", ""),
    "price_of_diesel_per_mwh": ("totalDiesel", ""),
    "electricity_grid_expansion_costs_lv_mv_trafo_per_kw": ("MSLSPeakLoadElectricity_kW", ""),
    "electricity_grid_expansion_costs_mv_hv_trafo_per_kw": ("HSMSPeakLoadElectricity_kW", ""),
    "depreciation_costs_grid_battery_per_mwh": (
        "totalBatteryInstalledCapacity_MWh:Grid_battery_10MWh",
        "",
    ),
}


def calculate_total_costs(
    etm_inputs: dict, holon_config_gridconnections: list, holon_outputs: list
) -> float:
    """Calculates the costs KPI's - if we need it they can be reported back per category as well"""
    categories = Categories()
    categories.add_connections(holon_config_gridconnections)
    categories.add_carriers_and_infra(
        holon_outputs[0]
    )  # NOTE: is this indeed a list with one dict?
    categories.set_prices(etm_inputs)

    return categories.total_costs()


def format(output):
    """
    Cast curves to np arrays
    TODO: Jorrit vragen of die nummering uit de curves kan en gewoon een lijst kan worden
    en waarom zijn er 8761 uren??
    """
    if isinstance(output, list):
        return np.array(output[:8760])
    if isinstance(output, dict):
        return np.array(list(output.values())[:8760])
    return output


class Category:
    def __init__(self, name):
        self.name = name
        self.cost_items = []
        self.total_costs = 0

    def add_cost_items(self, connection):
        """Add cost_items based on a gridconnection"""
        for cost_item in connection["assets"]:
            new_cost_item = CostItem(connection["category"], **cost_item)
            if new_cost_item.valid():
                self.cost_items.append(new_cost_item)

    def add_cost_item(self, category, **kwargs):
        """Add cost_item"""
        cost_item = CostItem(category, **kwargs)
        if cost_item.valid():
            self.cost_items.append(cost_item)

    def set_prices(self, etm_inputs):
        """AU; S:lol"""
        for cost_item in self.cost_items:
            for key, val in ETM_MAPPING.items():
                if cost_item.match(*val):
                    # NOTE: if etm_key is not available, we set costs to zero
                    cost_item.set_price(etm_inputs.get(key, 0))
                    self.total_costs += cost_item.costs
                    break


class Categories:
    """Who belongs to which category. If you're not in here, you get excluded"""

    CATEGORIES = {
        "buildings_and_installations": ["BUILDING", "INDUSTRY"],
        "infrastructure": ["HSMSPeakLoadElectricity_kW", "MSLSPeakLoadElectricity_kW"],
        "flexibility": ["totalBatteryInstalledCapacity_MWh:Grid_battery_10MWh"],
        "energy_production": ["SOLARFARM"],
        "carriers": ["SystemHourlyElectricity", "totalMethane", "totalHydrogen", "totalDiesel"],
    }

    def __init__(self) -> None:
        self.categories = {cat: Category(cat) for cat in self.CATEGORIES.keys()}

    def total_costs(self):
        return sum((cat.total_costs for cat in self.categories.values()))

    def add_connections(self, gridconnections):
        """"""
        for connection in gridconnections:
            if not self._category_of(connection):
                continue
            self.categories[self._category_of(connection)].add_cost_items(connection)

    def add_carriers_and_infra(self, holon_output):
        """"""
        self._add_carriers(holon_output)
        self._add_from_output(holon_output, "infrastructure")
        self._add_from_output(holon_output, "flexibility")

    def set_prices(self, etm_inputs):
        for cat in self.categories.values():
            cat.set_prices(etm_inputs)

    def _category_of(self, connection):
        for category, subs in self.CATEGORIES.items():
            if connection["category"] in subs:
                return category

    def _add_carriers(self, holon_output):
        """Bit hardcoded with the import and export, but yeah.."""
        for carrier in self.CATEGORIES["carriers"]:
            imp = format(holon_output.get(f"{carrier}Import_MWh", 0))
            exp = format(holon_output.get(f"{carrier}Export_MWh", 0))

            self.categories["carriers"].add_cost_item(carrier, value=imp - exp)

    def _add_from_output(self, holon_output, category):
        """Yeah.. if it's not there just don't include it."""
        for cost_item in self.CATEGORIES[category]:
            value = self._value_for(cost_item, holon_output)

            if value:
                self.categories[category].add_cost_item(cost_item, value=value)

    def _value_for(self, cost_item: str, holon_output: dict):
        """
        Gets the value for the cost item form the HOLON output, treats item names with a ':' as dict
        references with max-depth 1
        """
        if cost_item in holon_output:
            return holon_output[cost_item]

        if cost_item.split(":")[0] in holon_output:
            top_item, sub_item = cost_item.split(":")
            return holon_output[top_item][sub_item]

        return None


class CostItem:
    def __init__(self, subcategory, **params):
        self.subcategory = subcategory
        self.cost_item_type = params.get("type", "")
        self.costs = None

        if "capacityElectricity_kW" in params:
            self.value = params["capacityElectricity_kW"]
        elif "capacityHeat_kW" in params:
            self.value = params["capacityHeat_kW"]
        elif "value" in params:
            self.value = params["value"]
        else:
            self.value = None

    def valid(self):
        return self.subcategory is not None and self.value is not None

    def match(self, sub_cat, cost_item_type):
        return self.subcategory == sub_cat and self.cost_item_type == cost_item_type

    def set_price(self, costs):
        if self.costs is not None:
            return

        # Sum curves to one number
        if isinstance(format(costs), np.ndarray):
            self.costs = np.inner(format(costs), self.value)

        else:
            self.costs = costs * self.value
