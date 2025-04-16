import {Step2DataType, step2RawData} from "@/components/IJzerboeren/Step2/step2-data"
import {HeatingType} from "@/components/IJzerboeren/HeatingType/heating-type"
import {fillInMissingLinksRoot} from "@/components/IJzerboeren/Sankey/fillInMissingLinks"

export type Step3DataType = Step2DataType

const ironPowderOutputs: Step3DataType = {
    inputs: {
        heatingType: HeatingType.IRON_POWDER,
    },
    outputs: {
        kpis: {
            gelijktijdigheid_kW: 2.2,
            lcoeVerwarmen_eurocentpkWh: 20,
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
                source: "Import ijzerpoeder",
                target: "Verbranding",
                value: 198,
            },
            {
                source: "Verbranding",
                target: "Warmtenet",
                value: 178,
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
    }
}

export const step3Data: Step3DataType[] = fillInMissingLinksRoot([...step2RawData, ironPowderOutputs])
