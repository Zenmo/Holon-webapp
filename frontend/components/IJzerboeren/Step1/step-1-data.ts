import {SankeyLink} from "@/components/IJzerboeren/Sankey/link"

export const sankeyLinks: SankeyLink[] = [
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
        value: 299,
    },
]
