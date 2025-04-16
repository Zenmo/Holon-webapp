import {DataType} from "csstype"
import {SankeyLink} from "@/components/IJzerboeren/Sankey/link"
import {getColorByNodeName} from "@/components/IJzerboeren/Sankey/node-styling"
import {SankeyNode} from "@/components/IJzerboeren/Sankey/node"

export function getLinkColor(link: SankeyLink, nodes: SankeyNode[]): DataType.Color {
    if (link.target === "Verlies") {
        return getColorByNodeName(link.target, nodes)
    }

    return getColorByNodeName(link.source, nodes)
}
