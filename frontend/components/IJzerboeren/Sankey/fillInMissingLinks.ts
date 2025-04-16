import {SankeyLink} from "@/components/IJzerboeren/Sankey/link"
import {zip, uniqWith} from "lodash"
import {Step2DataType} from "@/components/IJzerboeren/Step2/step2-data"

export function fillInMissingLinksRoot(datas: Step2DataType[]): Step2DataType[] {
    let allLinks = datas.map(data => data.outputs.sankey)
    allLinks = fillInMissingLinks(allLinks)

    return datas.map((data, i) => ({
        ...data,
        outputs: {
            ...data.outputs,
            sankey: allLinks[i],
        }
    }))
}

/**
 * Fill in empty links for the different scenarios so all scenarios have the same number of links.
 * This is so that the animation works better.
 */
export function fillInMissingLinks(linksPerScenario: SankeyLink[][]): SankeyLink[][] {
    return linksPerScenario.map(
        links => uniqueZeroLinks(linksPerScenario).map(zeroLink => {
            const link = links.find(l => l.source === zeroLink.source && l.target === zeroLink.target)
            return link ? link : zeroLink
        })
    )
}

export function sortByLengthDesc<T>(arrays: T[][]): T[][] {
    return arrays.toSorted((a, b) => b.length - a.length)
}

/**
 * This is kinda sub-optimal when it comes to preserving order.
 */
export function uniqueZeroLinks(links: SankeyLink[][]): SankeyLink[] {
    const sorted = sortByLengthDesc(links)
    const zipped = zip(...sorted)
    const merged = zipped.flat().filter(a => a !== undefined)
    const uniqueLinks = uniqWith(merged, (a, b) => a.source === b.source && a.target === b.target)
    return uniqueLinks.map(link => ({...link, value: 0}))
}
