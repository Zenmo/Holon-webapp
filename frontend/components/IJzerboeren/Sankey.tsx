"use client"

import {FunctionComponent, useLayoutEffect} from "react"
import {SankeyLink} from "@/components/IJzerboeren/Step1/step-1-data"
import {uniq} from "lodash"
import { useRandomInt } from "@/utils/useRandomInt"
import Plotly, {SankeyData} from "plotly.js-dist-min"

function convertSankeyDataToPlotly(links: SankeyLink[]): Partial<SankeyData> {
    const strings: string[] = links.flatMap(link => [link.source, link.target])
    const uniqueStrings = uniq(strings)

    const sources = links.map(link => uniqueStrings.indexOf(link.source))
    const targets = links.map(link => uniqueStrings.indexOf(link.target))
    const values = links.map(link => link.value)
    const labels = links.map(link => link.label || null)

    return {
        type: "sankey",
        // arrangement: "snap",
        orientation: "h",
        valuesuffix: "GWh",
        node: {
            pad: 15,
            thickness: 30,
            line: {
                color: "black",
                width: 0.5
            },
            label: uniqueStrings,
            color: uniqueStrings.map(() => "blue")
        },
        link: {
            source: sources,
            target: targets,
            value:  values,
            label: labels,
        }
    }
}

const plotlySankeyLayout = {
    title: {
        text: "Basic Sankey"
    },
    font: {
        size: 10
    }
}

export const IronPowderSankey: FunctionComponent<{links: SankeyLink[]}> = ({links}) => {

    const divId = "sankey" + useRandomInt()

    useLayoutEffect(() => {
        console.log("WOOOOOOOOOOOT")

        Plotly.react(divId, [convertSankeyDataToPlotly(links)], plotlySankeyLayout)
        // const width = rightColumnRef.current?.clientWidth;
        // if (width) {
        //     setSankeyWidth(width);
        // }
    }, [links]);

    return (
        <div id={divId} />
    )
}
