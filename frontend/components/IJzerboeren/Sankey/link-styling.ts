import {DataType} from "csstype"
import {SankeyLink} from "@/components/IJzerboeren/Sankey/link"
import {getColorByNodeName} from "@/components/IJzerboeren/Sankey/node-styling"

export function getLinkColor(link: SankeyLink): DataType.Color {
    if (link.target === "Verlies") {
        return getColorByNodeName(link.target)
    }

    return getColorByNodeName(link.source)
}
