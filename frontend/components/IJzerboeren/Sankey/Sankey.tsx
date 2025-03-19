"use client"

import {FunctionComponent, useLayoutEffect, useRef} from "react"
import {uniq, uniqBy} from "lodash"
import { useRandomInt } from "@/utils/useRandomInt"
import Plotly, {SankeyData} from "plotly.js-dist-min"
import chroma from "chroma-js";
import {getColorByNodeName} from "@/components/IJzerboeren/Sankey/nodes"
import {SankeyLink} from "@/components/IJzerboeren/Sankey/link"

function convertSankeyDataToPlotly(links: SankeyLink[]): Partial<SankeyData> {
    const nodeStrings: string[] = links.flatMap(link => [link.source, link.target])
    const uniqueNodeStrings = uniq(nodeStrings)
    const nodeColors = uniqueNodeStrings.map(getColorByNodeName)

    const sources = links.map(link => uniqueNodeStrings.indexOf(link.source))
    const targets = links.map(link => uniqueNodeStrings.indexOf(link.target))
    const values = links.map(link => link.value)
    const labels = links.map(link => link.label || null)
    const linkColors = links.map(link => chroma(getColorByNodeName(link.source)).alpha(.5).hex())

    return {
        type: "sankey",
        name: "main",
        orientation: "h",
        valuesuffix: "MWh",
        node: {
            pad: 15,
            thickness: 30,
            line: {
                color: "black",
                width: 0.5
            },
            label: uniqueNodeStrings,
            color: nodeColors,
            hovertemplate: "%{label}",
        },
        link: {
            hoverinfo: "all",
            hovertemplate: "%{source.label} ➔ %{target.label}",
            source: sources,
            target: targets,
            value:  values,
            label: labels,
            color: linkColors,
        }
    }
}

const plotlySankeyLayout: Partial<Plotly.Layout> = {
    title: {
        text: "Energiestromen",
    },
    font: {
        size: 14,
    },
    height: 600,
    // I would like to set Y size option here but it seems not possible
}

const transitionTimeMs = 700

function doTransition(divId: string, oldLinks: SankeyLink[], newLinks: SankeyLink[], startTimeMs = 0): void {
    requestAnimationFrame((currentTimeMs: DOMHighResTimeStamp) => {
        if (startTimeMs === 0) {
            startTimeMs = currentTimeMs
        }

        const elapsedMs = currentTimeMs - startTimeMs
        const ratio = Math.min(elapsedMs / transitionTimeMs, 1)

        const allLinks = uniqBy([
            ...newLinks,
            ...oldLinks,
        ], link => `${link.source}__${link.target}`)

        const linksWithIntermediateValues = allLinks.map(link => {
            const oldLink = oldLinks.find(oldLink => oldLink.target == link.target && oldLink.source == link.source)
            const oldValue = oldLink ? oldLink.value : 0

            const newLink = newLinks.find(newLink => newLink.target == link.target && newLink.source == link.source)
            const newValue = newLink ? newLink.value : 0

            const easeOutCubic = (t: number) => (--t) * t * t + 1;
            const intermediateValue = oldValue + (newValue - oldValue) * easeOutCubic(ratio)

            return {
                ...link,
                value: intermediateValue
            }
        })

        Plotly.react(divId, [convertSankeyDataToPlotly(linksWithIntermediateValues)], plotlySankeyLayout)

        if (ratio < 1) {
            doTransition(divId, oldLinks, newLinks, startTimeMs)
        }
    })
}

export const IronPowderSankey: FunctionComponent<{links: SankeyLink[]}> = ({links}) => {
    const divId = "sankey" + useRandomInt()
    const divRef = useRef<HTMLDivElement | null>(null)

    const previousLinks = useRef<SankeyLink[] | null>(null)

    useLayoutEffect(() => {
        const width = divRef.current?.parentElement?.clientWidth;
        if (previousLinks.current === null) {
            Plotly.react(divId, [convertSankeyDataToPlotly(links)], { ...plotlySankeyLayout, width })
        } else {
            doTransition(divId, previousLinks.current, links)
        }
        previousLinks.current = links
    }, [links, divId]);

    return (
        <div id={divId} ref={divRef}/>
    )
}
