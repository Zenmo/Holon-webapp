
import {SankeyLink} from "@/components/IJzerboeren/Sankey/link"
import {HeatingType} from "@/components/IJzerboeren/HeatingType/heating-type"
import {IJzerboerenKPIs} from "@/components/IJzerboeren/KPIs/KPIs"
import {fillInMissingLinksRoot} from "@/components/IJzerboeren/Sankey/fillInMissingLinks"

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
            kpis: {
                gelijktijdigheid_kW: 2.6,
                lcoeVerwarmen_eurocentpkWh: 12,
                co2emission_t: 138,
            },
            sankey: [
                // electricity
                {
                    source: "Import elektriciteit",
                    target: "Lokaal verbruik",
                    value: 294,
                },
                {
                    source: "Opwek elektriciteit",
                    target: "Lokaal verbruik",
                    value: 114,
                },
                {
                    source: "Opwek elektriciteit",
                    target: "Export",
                    value: 54,
                },
                {
                    source: "Lokaal verbruik",
                    target: "Laden EV's",
                    value: 54,
                },
                {
                    source: "Lokaal verbruik",
                    target: "Huishoudverbruik",
                    value: 123,
                },
                {
                    source: "Lokaal verbruik",
                    target: "Verwarming",
                    value: 172,
                },
                {
                    source: "Lokaal verbruik",
                    target: "Warm water",
                    value: 41,
                },
                {
                    source: "Lokaal verbruik",
                    target: "Koken",
                    value: 18,
                },

                {
                    source: "Import benzine",
                    target: "Brandstofauto's",
                    value: 299,
                },
            ],
        },
    },
    {
        inputs: {
            heatingType: "GAS_BURNER",
        },
        outputs: {
            kpis: {
                gelijktijdigheid_kW: 1.5,
                lcoeVerwarmen_eurocentpkWh: 15,
                co2emission_t: 305,
            },
            sankey: [
                {
                    source: "Import elektriciteit",
                    target: "Lokaal verbruik",
                    value: 177,
                },
                {
                    source: "Opwek elektriciteit",
                    target: "Lokaal verbruik",
                    value: 37,
                },
                {
                    source: "Opwek elektriciteit",
                    target: "Export",
                    value: 96,
                },


                {
                    source: "Lokaal verbruik",
                    target: "Laden EV's",
                    value: 54,
                },
                {
                    source: "Lokaal verbruik",
                    target: "Huishoudverbruik",
                    value: 150,
                },
                {
                    source: "Import gas",
                    target: "Koken",
                    value: 22,
                },
                {
                    source: "Import gas",
                    target: "Warm water",
                    value: 125,
                },
                {
                    source: "Import gas",
                    target: "Verwarming",
                    value: 368,
                },

                {
                    source: "Import benzine",
                    target: "Brandstofauto's",
                    value: 299,
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
                gelijktijdigheid_kW: 2.1,
                lcoeVerwarmen_eurocentpkWh: 22,
                co2emission_t: 115, // TIJDELIJK!!!!!!!!!!!!!!!
            },
            sankey: [
                {
                    source: "Import elektriciteit",
                    target: "Lokaal verbruik",
                    value: 183,
                },
                {
                    source: "Opwek elektriciteit",
                    target: "Lokaal verbruik",
                    value: 40,
                },
                {
                    source: "Opwek elektriciteit",
                    target: "Export",
                    value: 93,
                },

                {
                    source: "Lokaal verbruik",
                    target: "Laden EV's",
                    value: 54,
                },
                {
                    source: "Lokaal verbruik",
                    target: "Huishoudverbruik",
                    value: 105,
                },
                {
                    source: "Lokaal verbruik",
                    target: "Koken",
                    value: 18,
                },

                {
                    source: "Warmtenet",
                    target: "Warm water",
                    value: 125,
                },
                {
                    source: "Warmtenet",
                    target: "Verwarming",
                    value: 368,
                },

                {
                    source: "Import benzine",
                    target: "Brandstofauto's",
                    value: 299,
                },
            ],
        },
    },
]

export const step2Data = fillInMissingLinksRoot(step2RawData)
