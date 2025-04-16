
import {SankeyLink} from "@/components/IJzerboeren/Sankey/link"
import {HeatingType} from "@/components/IJzerboeren/HeatingType/heating-type"
import {IJzerboerenKPIs} from "@/components/IJzerboeren/KPIs/KPIs"
import {fillInMissingLinksRoot} from "@/components/IJzerboeren/Sankey/fillInMissingLinks"
import {heatPumpKpis, heatPumpSankeyLinks} from "@/components/IJzerboeren/Step1/step-1-data"

export interface Step2DataType {
    inputs: Step2Inputs
    outputs: Step2Outputs
}

export interface Step2Inputs {
    heatingType: keyof typeof HeatingType
}

export interface Step2Outputs {
    kpis: IJzerboerenKPIs
    sankey: SankeyLink[]
}

export const step2RawData: Step2DataType[] = [
    {
        inputs: {
            heatingType: "HEAT_PUMP",
        },
        outputs: {
            kpis: heatPumpKpis,
            sankey: heatPumpSankeyLinks,
        },
    },
    {
        inputs: {
            heatingType: "GAS_BURNER",
        },
        outputs: {
            kpis: {
                gelijktijdigheid_kW: 2.0,
                lcoeVerwarmen_eurocentpkWh: 15,
                co2emission_t: 137,
            },
            sankey: [
                {
                    source: "Import elektriciteit",
                    target: "Lokaal verbruik",
                    value: 129,
                },
                {
                    source: "Opwek elektriciteit",
                    target: "Lokaal verbruik",
                    value: 57,
                },
                {
                    source: "Opwek elektriciteit",
                    target: "Export",
                    value: 84,
                },


                {
                    source: "Lokaal verbruik",
                    target: "Laden EV's",
                    value: 54,
                },
                {
                    source: "Lokaal verbruik",
                    target: "Huishoudverbruik",
                    value: 129,
                },
                {
                    source: "Import gas",
                    target: "Koken",
                    value: 20,
                },
                {
                    source: "Import gas",
                    target: "Warm water",
                    value: 94,
                },
                {
                    source: "Import gas",
                    target: "Verwarming",
                    value: 84,
                },

                {
                    source: "Import benzine",
                    target: "Brandstofauto's",
                    value: 259,
                },
            ],
        },
    },
    {
        inputs: {
            heatingType: "DISTRICT_HEATING",
        },
        outputs: {
            kpis: {
                gelijktijdigheid_kW: 2.2,
                lcoeVerwarmen_eurocentpkWh: 22,
                co2emission_t: 105,
            },
            sankey: [
                {
                    source: "Import elektriciteit",
                    target: "Lokaal verbruik",
                    value: 142,
                },
                {
                    source: "Opwek elektriciteit",
                    target: "Lokaal verbruik",
                    value: 64,
                },
                {
                    source: "Opwek elektriciteit",
                    target: "Export",
                    value: 77,
                },

                {
                    source: "Lokaal verbruik",
                    target: "Laden EV's",
                    value: 57,
                },
                {
                    source: "Lokaal verbruik",
                    target: "Huishoudverbruik",
                    value: 129,
                },
                {
                    source: "Lokaal verbruik",
                    target: "Koken",
                    value: 20,
                },

                {
                    source: "Warmtenet",
                    target: "Warmtegebruik in huis",
                    value: 169,
                },

                {
                    source: "Import benzine",
                    target: "Brandstofauto's",
                    value: 259,
                },
            ],
        },
    },
]

export const step2Data = fillInMissingLinksRoot(step2RawData)
