## Cloudclient

1. Datamodel (`mvp.py` is now implemented as fixture in the datamodel)
2. Perhaps a coupling to the cost module `ETM_MAPPING`? To enforce the correct data on response return from AL
3. Below a `yaml` with the options that we might need. Although a part is for `# local` development. 


```yaml
anylogic_cloud:
  api_key: 7a3563c1-ea1c-41d6-8009-b7abfd93f7ba
  url: "https://engine.holontool.nl"
options:
  path: ".." # local
  query_api: True
  model_name: Base_5dec
  version: 1 # new!
  config_file: input/mvp.py # local
  timestep_hours: 0.25
  force_uncached: false
  show_progress: false
  parallelize: true 
  log_exceptions: false
  use_datamodel: true # local
inputs: # local
 - anylogic_key: P actors config JSON 
   file: actors
 - anylogic_key: P grid connection config JSON
   file: gridconnections
 - anylogic_key: P grid node config JSON
   file: gridnodes
 - anylogic_key: P policies config JSON
   file: policies
outcomes: 
 - anylogic_key: O output runSettings
   human_key: APIOutputRunData
   writeExcel: False # local
   writeJSON: False # local
   print: False # local
 - anylogic_key: O total cost data
   human_key: APIOutputTotalCostData
   writeExcel: False # local
   writeJSON: False # local
   print: False # local
```


## ETM Upscaling

TODO:
1. Multiple convert with statements?
2. Key-value pairs (upscaling factors) that are linkable (FK) at value field
3. Differentiate between `upscaling_share` and `upscaling_factor`



```yaml
api_url: "https://beta-engine.energytransitionmodel.com/api/v3/scenarios/"
scenario:
  id: 2171098 # KEV
```


### Example data format
```yml
installed_energy_grid_battery:
  value:
    type: input
    data: value
    etm_key: capacity_of_energy_flexibility_mv_batteries_electricity
  conversion: multiply
  convert_with_value:
    type: static
    value: 175 # divided by 100 since both the button and the slider will use this. Not 0 or 1 but a whole range is possible between 0 and 100
    key: scaling_factor_grid_batteries
```
**@Nora:**
> What does key do in this case?

Not that important, is just used for passing data to the module.

> Is `static` a supported type? Or only at the `convert_with_value`



### Description of data format
```
<ITEM_NAME>:
  value:                The main value on which conversions will be done
    type:               Which type of ETM request is needed. Right now only 'query', 'input' and
                        'node_property' are supported. In the future the curves endpoint
                        can be added as well.
    data:               What data to look for / expect. For queries this can be either
                        'value' or 'curve'. For node properties you can specify which
                        property of the node is needed. The path to the property should be
                        separated by dots ('.'), for example:
                        technical.electricity_output_conversion.future
                        For inputs this should always be 'value'
    etm_key:            The key of the query to send to the ETM, or the name of the node
    conversion:         If a conversion is nesccesary, please specify. Currently only 'divide'
                        and 'multiply' are supported.
    convert_with_value: When conversion is set, specify with which ETM value the item should be
                        converted with. E.g for 'divide' this is the value to be divided by.
                        This value has the same properties as the main 'value' field.
```

## Cost actor overview
???

## ETM Cost module
1. Depends on upscaling module for querying ETM values
2. Uses an explicit mapping (`ETM_MAPPING`), perhaps we should control that using the datamodel? **@Nora** / **@Mathijs**
3. Depends on AL-input and AL-output (serialize AL-output)
4. 2 stages:
   1. What to query
   2. How to map query to ALinput/output
   3. What conversion to do

```yaml
api_url: "https://beta-engine.energytransitionmodel.com/api/v3/scenarios/"
scenario:
  id: 2171098 # KEV
```

```python
ETM_MAPPING = {
    "depreciation_costs_buildings_solar_panels_per_kw": ("BUILDING", "PHOTOVOLTAIC"),
    "depreciation_costs_solar_farm_per_kw": ("SOLARFARM", "PHOTOVOLTAIC"),
    "depreciation_costs_buildings_gas_burner_per_kw": ("BUILDING", "GAS_BURNER"),
    "depreciation_costs_industry_solar_panels_per_kw": ("INDUSTRY", "PHOTOVOLTAIC"),
    "depreciation_costs_industry_gas_burner_per_kw": ("INDUSTRY", "GAS_BURNER"),
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
```