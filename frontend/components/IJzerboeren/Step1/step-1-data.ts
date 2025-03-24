import {SankeyLink} from "@/components/IJzerboeren/Sankey/link"
import {IJzerboerenKPIs} from "@/components/IJzerboeren/KPIs/KPIs"

export const heatPumpSankeyLinks: SankeyLink[] = [
    /* import E */
    // {
    //     source: "Import elektriciteit",
    //     target: "Laden EV's",
    //     value: 43,
    // },
    // {
    //     source: "Import elektriciteit",
    //     target: "Huishoudverbruik",
    //     value: 94,
    // },
    // {
    //     source: "Import elektriciteit",
    //     target: "Verwarming",
    //     value: 102,
    // },
    // {
    //     source: "Import elektriciteit",
    //     target: "Warm water",
    //     value: 41,
    // },
    // {
    //     source: "Import elektriciteit",
    //     target: "Koken",
    //     value: 14,
    // },

    {
        source: "Import elektriciteit",
        target: "Lokaal verbruik",
        value: 185,
    },
    {
        source: "Opwek elektriciteit",
        target: "Lokaal verbruik",
        value: 72,
    },
    {
        source: "Opwek elektriciteit",
        target: "Export",
        value: 69,
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
        target: "Verwarming",
        value: 24,
    },
    {
        source: "Lokaal verbruik",
        target: "Warm water",
        value: 27,
    },
    {
        source: "Lokaal verbruik",
        target: "Koken",
        value: 20,
    },



    /* opwek E */
    // {
    //     source: "Opwek elektriciteit",
    //     target: "Laden EV's",
    //     value: 11,
    // },
    // {
    //     source: "Opwek elektriciteit",
    //     target: "Huishoudverbruik",
    //     value: 29,
    // },
    // {
    //     source: "Opwek elektriciteit",
    //     target: "Koken",
    //     value: 4,
    // },
    // {
    //     source: "Opwek elektriciteit",
    //     target: "Verwarming",
    //     value: 70,
    // },


    {
        source: "Import benzine",
        target: "Brandstofauto's",
        value: 259,
    },
]

export const heatPumpKpis: IJzerboerenKPIs = {
    gelijktijdigheid_kW: 3.0,
    lcoeVerwarmen_eurocentpkWh: 12,
    co2emission_t: 117,
}
