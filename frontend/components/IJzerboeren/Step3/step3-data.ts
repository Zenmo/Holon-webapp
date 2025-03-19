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
            gelijktijdigheid_kW: 2.1,
            lcoeVerwarmen_eurocentpkWh: 16,
            co2emission_t: 115,
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
                value: 170,
            },

            {
                source: "Import ijzerpoeder",
                target: "Warmtenet",
                value: 917,
            },
            {
                source: "Warmtenet",
                target: "Koken",
                value: 22,
            },
            {
                source: "Warmtenet",
                target: "Warm water",
                value: 123,
            },
            {
                source: "Warmtenet",
                target: "Verwarming",
                value: 361,
            },

            {
                source: "Import benzine",
                target: "Brandstofauto's",
                value: 299,
            },
        ],
    }
}

export const step3Data: Step3DataType[] = fillInMissingLinksRoot([...step2RawData, ironPowderOutputs])
