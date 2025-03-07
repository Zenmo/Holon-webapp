import {DataType} from "csstype"

export interface SankeyNode {
    name: string
    color: DataType.Color
}

export const sankeyNodes: SankeyNode[] = [
    {
        name: "Import gas",
        color: "brown",
    },
    {
        name: "Import stroom",
        color: "grey",
    },
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
        name: "Reductie",
        color: "orange",
    },
    {
        name: "Warmtenet",
        color: "red",
    },
    {
        name: "Huishoudens",
        color: "pink",
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
