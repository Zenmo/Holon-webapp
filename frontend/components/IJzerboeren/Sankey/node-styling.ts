import {DataType} from "csstype"
import {SankeyNode} from "@/components/IJzerboeren/Sankey/node"

export const defaultSankeyNodes: SankeyNode[] = [
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
        name: "Koken",
        color: "pink",
    },

    // Heat
    {
        name: "Verwarming",
        color: "red",
    },
    {
        name: "Warmtegebruik in huis",
        color: "red",
    },
    {
        name: "Warm water",
        color: "red",
    },
    {
        name: "Warmtenet",
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
    {
        name: "Verbranding",
        color: "brown",
    },


    // Iron powder processing
    {
        name: "Wind + zon",
        color: "green",
    },
    {
        name: "Verlies",
        color: "lightgrey",
    },
    {
        name: "Regeneratie",
        color: "dimgrey",
    },
    {
        name: "Elektrolyse",
        color: "lightblue",
    },
    {
        name: "Warmteafname huizen",
        color: "red",
    },


    // Unused
    {
        name: "Warmtepomp",
        color: "blueviolet",
    },
]

export function getColorByNodeName(nodeName: string, sankeyNodes: SankeyNode[]): DataType.Color {
    const node = sankeyNodes.find(it => it.name === nodeName)
    return node?.color ?? "blue"
}

export function getXByNodeName(nodeName: string, sankeyNodes: SankeyNode[]): number | undefined {
    return sankeyNodes.find(it => it.name === nodeName)?.x
}

export function getYByNodeName(nodeName: string, sankeyNodes: SankeyNode[]): number | undefined {
    return sankeyNodes.find(it => it.name === nodeName)?.y
}
