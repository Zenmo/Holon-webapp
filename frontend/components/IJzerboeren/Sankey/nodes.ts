import {DataType} from "csstype"

export interface SankeyNode {
    name: string
    color: DataType.Color
}

export const sankeyNodes: SankeyNode[] = [
    // fossils
    {
        name: "Import gas",
        color: "brown",
    },
    {
        name: "Import benzine",
        color: "orange",
    },
    {
        name: "Brandstofauto's",
        color: "orange",
    },

    // electricity production
    {
        name: "Import elektriciteit",
        color: "mediumpurple",
    },
    {
        name: "Opwek elektriciteit",
        color: "green",
    },
    {
        name: "Export",
        color: "green",
    },

    // electricity consumption
    {
        name: "Lokaal verbruik",
        color: "mediumpurple",
    },
    {
        name: "Lokaal verbruik",
        color: "mediumpurple",
    },
    {
        name: "Huishoudverbruik",
        color: "mediumpurple",
    },
    {
        name: "Laden EV's",
        color: "mediumpurple",
    },
    {
        name: "Huishoudverbruik",
        color: "mediumpurple",
    },
    {
        name: "Huishoudverbruik",
        color: "mediumpurple",
    },
    {
        name: "Koken",
        color: "pink",
    },

    // Heat
    {
        name: "Verwarming",
        color: "red",
    },
    {
        name: "Warm water",
        color: "red",
    },
    {
        name: "Afname warmtenet",
        color: "red",
    },
    {
        name: "Warmtenet",
        color: "red",
    },
    {
        name: "Import ijzerpoeder",
        color: "lightblue"
    },


    // Old stuff
    {
        name: "Verlies",
        color: "white",
    },
    {
        name: "Elektrolyzer",
        color: "lightblue",
    },
    {
        name: "Reductie",
        color: "orange",
    },
    {
        name: "Warmtepomp",
        color: "blueviolet",
    },
]

export function getColorByNodeName(nodeName: string): DataType.Color {
    const node = sankeyNodes.find(it => it.name === nodeName)
    if (node) {
        return node.color
    } else {
        return "blue"
    }
}
