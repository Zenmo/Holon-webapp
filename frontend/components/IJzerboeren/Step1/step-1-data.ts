
type Step1DataType = {
    inputs: {
        ironPowder_tonnes: number,
    }
    outputs: {
        gridLoad_r: number,
        fuelCost_eur: number,
    }
}

export const Step1Data: Step1DataType[] = [
    {
        "inputs": {
            "ironPowder_tonnes": 0,
        },
        "outputs": {
            "gridLoad_r": 1.2,
            "fuelCost_eur": 15000,
        }
    },
    {
        "inputs": {
            "ironPowder_tonnes": 10,
        },
        "outputs": {
            "gridLoad_r": 1,
            "fuelCost_eur": 16000,
        }
    },
    {
        "inputs": {
            "ironPowder_tonnes": 20,
        },
        "outputs": {
            "gridLoad_r": 0.8,
            "fuelCost_eur": 17000,
        }
    },
]
