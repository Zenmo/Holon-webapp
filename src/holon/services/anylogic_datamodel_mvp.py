from pathlib import Path

from cloudclient.datamodel import Payload, Actor, Contract

actors = [
    Actor(
        category="CONNECTIONOWNER",
        type="commercial",
        id="com1",
        parent_actor="hol1",
        contracts=[Contract(type="DEFAULT", contract_scope="ENERGYHOLON")],
    ),
    Actor(
        category="CONNECTIONOWNER",
        type="commercial",
        id="com2",
        parent_actor="hol1",
        contracts=[Contract(type="DEFAULT", contract_scope="ENERGYHOLON")],
    ),
    Actor(
        category="CONNECTIONOWNER",
        type="commercial",
        id="com3",
        parent_actor="hol1",
        contracts=[Contract(type="DEFAULT", contract_scope="ENERGYHOLON")],
    ),
    Actor(
        category="CONNECTIONOWNER",
        type="commercial",
        id="com4",
        parent_actor="hol1",
        contracts=[Contract(type="DEFAULT", contract_scope="ENERGYHOLON")],
    ),
    Actor(
        category="ENERGYSUPPLIER",
        id="sup1",
        parent_actor="nat",
    ),
    Actor(
        category="ENERGYHOLON",
        id="hol1",
        parent_actor="sup1",
        contracts=[Contract(type="GOPACS", contract_scope="GRIDOPERATOR")],
    ),
    Actor(
        category="GRIDOPERATOR",
        id="o1",
        parent_actor="nat",
    ),
]

from cloudclient.datamodel.defaults import (
    Logistics_fleet_hgv_E,
    Solarpanels_1MW,
    Grid_battery_10MWh,
    Building_solarpanels_0kWp,
    Building_gas_burner_60kW,
)

from cloudclient.datamodel.gridconnections import (
    IndustryGridConnection,
    BuildingGridConnection,
    ProductionGridConnection,
)

gridconnections = [
    BuildingGridConnection(
        insulation_label="NONE",
        heating_type="GASBURNER",
        type="LOGISTICS",
        owner_actor="com1",
        parent_electric="E2",
        id="b1",
        capacity_kw=2000,
        assets=[
            Logistics_fleet_hgv_E,
            Building_solarpanels_0kWp,
            Building_gas_burner_60kW,
        ],
    ),
    IndustryGridConnection(
        heating_type="GASBURNER",
        type="INDUSTRY_OTHER",
        owner_actor="com2",
        parent_electric="E2",
        id="b2",
        capacity_kw=1000,
        assets=[Building_solarpanels_0kWp, Building_gas_burner_60kW],
    ),
    ProductionGridConnection(
        category="SOLARFARM",
        owner_actor="com3",
        parent_electric="E2",
        id="b3",
        capacity_kw=2000,
        assets=[Solarpanels_1MW, Solarpanels_1MW],
    ),
    ProductionGridConnection(
        category="GRIDBATTERY",
        owner_actor="com4",
        parent_electric="E2",
        id="b4",
        capacity_kw=1000,
        assets=[Grid_battery_10MWh],
    ),
]

from cloudclient.datamodel.gridnodes import ElectricGridNode

gridnodes = [
    ElectricGridNode(
        id="E2",
        parent="E1",
        owner_actor="o1",
        capacity_kw=1200,
        category="ELECTRICITY",
        type="MSLS",
    ),
    ElectricGridNode(
        id="E1",
        owner_actor="o1",
        capacity_kw=500000,
        category="ELECTRICITY",
        type="HSMS",
    ),
]

from cloudclient.datamodel.policies import Policy

policies = [
    Policy(
        parameter="EV_charging_attitude_standard",
        value="CHEAP",
        unit=None,
        comment="charging behaviour not contingent on holon",
    ),
    Policy(
        parameter="Grid_MS_congestion_allowance_level_kW",
        value="3",
        unit="kW",
        comment="gridOperator policy variable",
    ),
    Policy(
        parameter="Grid_MS_congestion_price",
        value="0.5",
        unit="kW",
        comment="gridOperator policy value",
    ),
    Policy(
        parameter="Grid_MS_congestion_threshold",
        value="0.7",
        unit="fr",
        comment="gridOperator policy value",
    ),
    Policy(
        parameter="Grid_MS_congestion_pricing_consumption",
        value="TRUE",
        unit=None,
        comment="gridOperator policy value",
    ),
    Policy(
        parameter="Grid_MS_congestion_pricing_production",
        value="FALSE",
        unit=None,
        comment="gridOperator policy value",
    ),
]

payload = Payload(
    actors=actors,
    gridconnections=gridconnections,
    gridnodes=gridnodes,
    policies=policies,
)
