"use client"

import {CSSProperties, FunctionComponent, MutableRefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react"
import {uniq, uniqBy, merge} from "lodash"
import { useRandomInt } from "@/utils/useRandomInt"
import Plotly, {SankeyData} from "plotly.js-dist-min"
import chroma from "chroma-js";
import {getColorByNodeName} from "@/components/IJzerboeren/Sankey/node-styling"
import {SankeyLink} from "@/components/IJzerboeren/Sankey/link"
import {getLinkColor} from "@/components/IJzerboeren/Sankey/link-styling"

function convertSankeyDataToPlotly(
    links: SankeyLink[],
    plotlyData: Partial<SankeyData>
): Partial<SankeyData> {
    const nodeStrings: string[] = links.flatMap(link => [link.source, link.target])
    const uniqueNodeStrings = uniq(nodeStrings)
    const nodeColors = uniqueNodeStrings.map(getColorByNodeName)

    const sources = links.map(link => uniqueNodeStrings.indexOf(link.source))
    const targets = links.map(link => uniqueNodeStrings.indexOf(link.target))
    const values = links.map(link => link.value)
    const labels = links.map(link => link.label || null)
    // const linkLabelColors = links.map(link => getColorByNodeName(link.source))
    const linkColors = links.map(link => chroma(getLinkColor(link)).alpha(.5).hex())

    return {
        type: "sankey",
        name: "main",
        orientation: "h",
        valuesuffix: "MWh",
        textfont: {
            // copied from globals.css
            family: [
                "Roboto",
                "Oxygen",
                "Ubuntu",
                "Cantarell",
                "Fira Sans",
                "Droid Sans",
                "Helvetica Neue",
                "sans-serif",
            ],
            size: 17,
            // todo add to typescript definitions
            weight: "bold",
            color: "white",
        },
        node: {
            pad: 15,
            thickness: 30,
            line: {
                color: "black",
                width: 0.5
            },
            label: uniqueNodeStrings,
            color: nodeColors,
            hoverlabel: {
                font: {
                    weight: "bold",
                    color: "white",
                },
            },
            /**
             * d = whole numbers
             */
            hovertemplate: "%{label} <extra>%{value:d} %{fullData.valuesuffix}</extra>",
            // todo add to typescript definitions
            // align: "right",
        },
        link: {
            hoverlabel: {
                font: {
                    weight: "bold",
                    color: "white",
                },
                // I would like to set the opaclabels from .65 opacity to 1 but it seems not possible.
                // property "bgcolor" only changes the color
            },
            hovertemplate: "%{source.label} ➔ %{target.label} <extra>%{value:d} %{fullData.valuesuffix}</extra>",
            source: sources,
            target: targets,
            value:  values,
            label: labels,
            color: linkColors,
        },
        ...plotlyData
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
    // I would like to set Y scale here but it seems not possible
}

const transitionTimeMs = 400

function doTransition(
    divId: string,
    oldLinks: SankeyLink[],
    newLinks: SankeyLink[],
    layout: Partial<Plotly.Layout>,
    plotlyData: Partial<Plotly.Data>,
    startTimeMs = 0,
): void {
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

        Plotly.react(divId, [convertSankeyDataToPlotly(linksWithIntermediateValues, plotlyData)], layout)

        if (ratio < 1) {
            doTransition(divId, oldLinks, newLinks, layout, plotlyData, startTimeMs)
        }
    })
}

export const IronPowderSankey: FunctionComponent<{
    links: SankeyLink[]
    style?: CSSProperties,
    // To customize plotly settings
    plotlyLayout?: Partial<Plotly.Layout>,
    // To customize plotly settings
    plotyData?: Partial<SankeyData>,
}> = ({
    links,
    style = {},
    plotlyLayout = {},
    plotyData = {},
}) => {
    const divId = "sankey" + useRandomInt()
    const [divRef, width] = useElementWidth()

    const previousLinks = useRef<SankeyLink[] | null>(null)

    const layout = useMemo(() => merge({}, {
        ...plotlySankeyLayout,
        width,
    }, plotlyLayout), [width, JSON.stringify(plotlyLayout)]);

    useLayoutEffect(() => {
        if (previousLinks.current === null) {
            Plotly.react(divId, [convertSankeyDataToPlotly(links, plotyData)], layout)
        } else {
            doTransition(divId, previousLinks.current, links, layout, plotyData)
        }
        previousLinks.current = links
    }, [links, divId, width]);

    return (
        <div id={divId} ref={divRef} style={{
            maxWidth: "50rem",
            ...style
        }} />
    )
}

function useElementWidth(): [MutableRefObject<HTMLElement | undefined>, number | undefined] {
    const divRef = useRef<HTMLElement | null>(null)
    const [width, setWidth] = useState<number | undefined>(divRef.current?.clientWidth)

    useEffect(() => {
        const listener = () => {
            console.log(divRef.current?.clientWidth)
            setWidth(divRef.current?.clientWidth)
        }
        window.addEventListener("resize", listener);
        return () => {
            window.removeEventListener("resize", listener)
        }
    }, [])

    useEffect(() => {
        setWidth(divRef.current?.clientWidth)
    }, [divRef.current])

    return [divRef, width]
}
