import {DataType} from "csstype"
import {sankeyNodes} from "@/components/IJzerboeren/Sankey/nodes"


export enum FavoriteClown {
    BASSIE = "BASSIE",
    DISTRICT_HEATING = "DISTRICT_HEATING",
    HEAT_PUMP = "HEAT_PUMP",
}

export interface Step2DataType {
    inputs: Step2Inputs
    outputs: Step1Outputs
}

export interface Step2Inputs {
    heatingType: keyof typeof FavoriteClown
}

export interface SankeyLink {
    source: string
    target: string
    value: number
    label?: string
}

export interface Step1Outputs {
    kpis: Step1Kpis
    sankey: SankeyLink[]
}

export interface Step1Kpis {
    gridLoad_r: number
    cost_eur: number
    sustainability_r: number
}

export function getColorByNodeName(nodeName: string): DataType.Color {
    const node = sankeyNodes.find(it => it.name === nodeName)
    if (node) {
        return node.color
    } else {
        return "blue"
    }
}

export const step2Data: Step2DataType[] = [
    {
        inputs: {
            heatingType: "BASSIE",
        },
        outputs: {
            kpis: {
                gridLoad_r: 0.8,
                cost_eur: 20000,
                sustainability_r: 0.2,
            },
            sankey: [
                {
                    source: "Import gas",
                    target: "Huishoudens",
                    value: 5,
                    label: "Aardgas",
                },
                {
                    source: "Import stroom",
                    target: "Elektrolyzer",
                    value: 0,
                    label: "Electriciteit",
                },
                {
                    source: "Elektrolyzer",
                    target: "Verlies",
                    value: 0,
                },
                {
                    source: "Elektrolyzer",
                    target: "Reductie",
                    value: 0,
                    label: "Waterstof",
                },
                {
                    source: "Reductie",
                    target: "Warmtenet",
                    value: 0, // I assume about 5 GWh heat demand
                    label: "IJzerpoeder"
                },
                {
                    source: "Warmtenet",
                    target: "Huishoudens",
                    value: 0,
                    label: "Heet water",
                },
                {
                    source: "Import stroom",
                    target: "Huishoudens",
                    value: 2,
                    label: "Verbruik huishoudens"
                }
            ],
        },
    },
    {
        inputs: {
            heatingType: "HEAT_PUMP",
        },
        outputs: {
            kpis: {
                gridLoad_r: 1.6,
                cost_eur: 18000,
                sustainability_r: 0.8,
            },
            sankey: [
                {
                    source: "Import gas",
                    target: "Huishoudens",
                    value: 0,
                    label: "Aardgas",
                },
                {
                    source: "Import stroom",
                    target: "Elektrolyzer",
                    value: 0,
                    label: "Electriciteit",
                },
                {
                    source: "Elektrolyzer",
                    target: "Verlies",
                    value: 0,
                },
                {
                    source: "Elektrolyzer",
                    target: "Reductie",
                    value: 0,
                    label: "Waterstof",
                },
                {
                    source: "Reductie",
                    target: "Warmtenet",
                    value: 0, // I assume about 5 GWh heat demand
                    label: "IJzerpoeder"
                },
                {
                    source: "Warmtenet",
                    target: "Huishoudens",
                    value: 0,
                    label: "Heet water",
                },
                {
                    source: "Import stroom",
                    target: "Warmtepomp",
                    value: 2,
                },
                {
                    source: "Import stroom",
                    target: "Huishoudens",
                    value: 2,
                    label: "Verbruik huishoudens"
                },
                {
                    source: "Warmtepomp",
                    target: "Huishoudens",
                    value: 5,
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
                gridLoad_r: 0.7,
                cost_eur: 22000,
                sustainability_r: 1,
            },
            sankey: [
                {
                    source: "Import gas",
                    target: "Huishoudens",
                    value: 0,
                    label: "Aardgas",
                },
                {
                    source: "Import stroom",
                    target: "Elektrolyzer",
                    value: 7,
                    label: "Electriciteit",
                },
                {
                    source: "Elektrolyzer",
                    target: "Verlies",
                    value: 2,
                },
                {
                    source: "Elektrolyzer",
                    target: "Reductie ijzeroxide",
                    value: 5,
                    label: "Waterstof",
                },
                {
                    source: "Reductie ijzeroxide",
                    target: "Warmtenet",
                    value: 5, // I assume about 5 GWh heat demand
                    label: "IJzerpoeder"
                },
                {
                    source: "Warmtenet",
                    target: "Huishoudens",
                    value: 5,
                    label: "Heet water",
                },
                {
                    source: "Import stroom",
                    target: "Huishoudens",
                    value: 2,
                    label: "Verbruik huishoudens"
                }
            ],
        },
    },
]
