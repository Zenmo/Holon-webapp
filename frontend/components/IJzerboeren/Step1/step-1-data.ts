

export enum HeatingType {
    GAS_BURNER = "GAS_BURNER",
    DISTRICT_HEATING = "DISTRICT_HEATING",
    HEAT_PUMP = "HEAT_PUMP",
}

export interface Step1DataType {
    inputs: Step1Inputs
    outputs: Step1Outputs
}

export interface Step1Inputs {
    heatingType: keyof typeof HeatingType
}

export interface Step1Outputs {
    kpis: Step1Kpis
    sankey: any[]
}

export interface Step1Kpis {
    gridLoad_r: number
    cost_eur: number
    sustainability_r: number
}

export const step1Data: Step1DataType[] = [
    {
        inputs: {
            heatingType: "GAS_BURNER",
        },
        outputs: {
            kpis: {
                gridLoad_r: 0.8,
                cost_eur: 20000,
                sustainability_r: 0.2,
            },
            sankey: [
                {
                    source: "Opwek groene stroom",
                    target: "Elektrolyzer",
                    value: 1000,
                },
                {
                    source: "Elektrolyzer",
                    target: "Verlies",
                    value: 600,
                },
                {
                    source: "Elektrolyzer",
                    target: "Reductie ijzeroxide",
                    value: 400,
                },
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
            sankey: [],
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
            sankey: [],
        },
    },
]
