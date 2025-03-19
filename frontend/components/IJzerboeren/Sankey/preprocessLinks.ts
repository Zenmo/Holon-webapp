import {SankeyLink} from "@/components/IJzerboeren/Sankey/link"
import {zip, uniqWith} from "lodash"

/**
 * fill in empty links for the different scenarios so the animation works better.
 */
function preprocessLinks(links: SankeyLink[][]): SankeyLink[][] {
    // @ts-ignore seems all right
    const allLinks: SankeyLink[] = zip(links).flat()
    const uniqueLinks = uniqWith(allLinks, )

    return []
}

function getLinkPair(link: SankeyLink) {
    return link.source
}
