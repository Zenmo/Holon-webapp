"use client"

import {FunctionComponent, useLayoutEffect, useRef} from "react"
import {getColorByNodeName, SankeyLink, sankeyNodes} from "@/components/IJzerboeren/Step1/step-1-data"
import {uniq, uniqBy} from "lodash"
import { useRandomInt } from "@/utils/useRandomInt"
import Plotly, {SankeyData} from "plotly.js-dist-min"

function convertSankeyDataToPlotly(links: SankeyLink[]): Partial<SankeyData> {
    const nodeStrings: string[] = links.flatMap(link => [link.source, link.target])
    const uniqueNodeStrings = uniq(nodeStrings)
    const colors = uniqueNodeStrings.map(getColorByNodeName)

    const sources = links.map(link => uniqueNodeStrings.indexOf(link.source))
    const targets = links.map(link => uniqueNodeStrings.indexOf(link.target))
    const values = links.map(link => link.value)
    const labels = links.map(link => link.label || null)

    return {
        type: "sankey",
        orientation: "h",
        valuesuffix: "GWh",
        node: {
            pad: 15,
            thickness: 30,
            line: {
                color: "black",
                width: 0.5
            },
            label: uniqueNodeStrings,
            color: colors,
        },
        link: {
            source: sources,
            target: targets,
            value:  values,
            label: labels,
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
    // I would like to set Y size option here but it seems not possible
}

const transitionTimeMs = 800

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

            const intermediateValue = oldValue + (newValue - oldValue) * ratio

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

    const previousLinks = useRef<SankeyLink[]>(null)

    useLayoutEffect(() => {
        if (previousLinks.current === null) {
            Plotly.react(divId, [convertSankeyDataToPlotly(links)], plotlySankeyLayout)
        } else {
            doTransition(divId, previousLinks.current, links)
        }
        // not sure why typescript/intellij doesn't like this assignment
        previousLinks.current = links
        // const width = rightColumnRef.current?.clientWidth;
        // if (width) {
        //     setSankeyWidth(width);
        // }
    }, [links]);

    return (
        <div id={divId} style={{color: "aqua"}}/>
    )
}
