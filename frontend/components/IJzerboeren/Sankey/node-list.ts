import {Map } from "immutable"
import {SankeyNode} from "@/components/IJzerboeren/Sankey/node"
import {defaultSankeyNodes} from "@/components/IJzerboeren/Sankey/node-styling"

export class NodeList {
    private readonly nodes = Map<string, SankeyNode>()

    constructor(nodes: Map<string, SankeyNode>) {
        this.nodes = nodes
    }

    static DEFAULT = new NodeList(
        Map(defaultSankeyNodes.map(node => [node.name, node]))
    )

    /**
     * Add a new node or override properties of existing node with the same name
     */
    update(newNode: SankeyNode): NodeList {
        return new NodeList(
            this.nodes.update(
                newNode.name,
                newNode,
                oldNode => ({
                    ...oldNode,
                    ...newNode,
                })
            )
        )
    }

    toArray(): SankeyNode[] {
        return Array.from(this.nodes.values())
    }
}
