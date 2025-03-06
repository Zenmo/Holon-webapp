import { KpiRow } from "@/components/IJzerboeren/KpiRow"
import { GridLoadKpi } from "@/components/KPIDashboard/KpiItems/GridLoadKpi"
import { CostKpi } from "@/components/KPIDashboard/KpiItems/CostKpi"
import { SustainabilityKpi } from "@/components/KPIDashboard/KpiItems/SustainabilityKpi"
import { HeatingTypeRadios } from "@/components/IJzerboeren/Step1/HeatingTypeRadios"
import {HeatingType, SankeyLink, step1Data, Step1Outputs} from "@/components/IJzerboeren/Step1/step-1-data"
import { useStateWithHistory } from "@/components/IJzerboeren/useStateWithHistory"
import {TwoColumnSimulationLayout} from "@/components/Blocks/SectionBlock/TwoColumn"
import {FunctionComponent, useLayoutEffect, useRef, useState} from "react"
import {uniq} from "lodash"
import Plotly, {SankeyData} from "plotly.js-dist-min"

/**
 * Convert our format to the format expected by recharts
 */
function convertSankeyDataToRecharts(links: SankeyLink[]) {
    const strings: string[] = links.flatMap(link => [link.source, link.target])
    const uniqueStrings = uniq(strings)
    const nodes = uniqueStrings.map(str => ({
        name: str,
    }))

    const numericLinks = links.map(link => ({
        value: link.value,
        source: uniqueStrings.indexOf(link.source),
        target: uniqueStrings.indexOf(link.target),
    }))

    return {
        nodes: nodes,
        links: numericLinks,
    }
}

function convertSankeyDataToPlotly(links: SankeyLink[]): Partial<SankeyData> {
    return {
        type: "sankey",
        orientation: "h",
        node: {
            pad: 15,
            thickness: 30,
            line: {
                color: "black",
                width: 0.5
            },
            label: ["A1", "A2", "B1", "B2", "C1", "C2"],
            color: ["blue", "blue", "blue", "blue", "blue", "blue"]
        },
        link: {
            source: [0,1,0,2,3,3],
            target: [2,3,3,4,4,5],
            value:  [8,4,2,8,4,2]
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

export const Step1: FunctionComponent = () => {
    const [heatingType, previousHeatingType, setHeatingType] =
        useStateWithHistory<HeatingType | null>(null)

    let currentOutputs: Nullable<Step1Outputs> = null
    if (heatingType) {
        currentOutputs = step1Data.find(r => r.inputs.heatingType === heatingType)?.outputs
    }
    const currentKpis = currentOutputs?.kpis

    let previousOutputs: Nullable<Step1Outputs> = null
    if (previousHeatingType) {
        previousOutputs = step1Data.find(r => r.inputs.heatingType === previousHeatingType)?.outputs
    }
    const previousKpis = previousOutputs?.kpis

    const rightColumnRef = useRef<HTMLDivElement | null>(null)
    const sankeyDivId = "sankeyStep1" // todo make non-unique
    const [sankeyWidth, setSankeyWidth] = useState(100);
    useLayoutEffect(() => {
        if (!currentOutputs) {
            return
        }

        Plotly.react(sankeyDivId, [convertSankeyDataToPlotly(currentOutputs.sankey)], plotlySankeyLayout)
        // const width = rightColumnRef.current?.clientWidth;
        // if (width) {
        //     setSankeyWidth(width);
        // }
    }, [currentOutputs]);

    if (currentOutputs?.sankey) {
        console.log(convertSankeyDataToRecharts(currentOutputs.sankey))
    }

    return (
        <div className="holonContentContainer">
            <TwoColumnSimulationLayout>
                <div>
                    <p>Hier een mooi verhaal over wat de afwegingen zijn bij het kiezen voor een energiesysteem</p>
                    <HeatingTypeRadios setHeatingType={setHeatingType} />
                </div>
                <div ref={rightColumnRef} style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
                    {currentOutputs &&
                        <div id="sankeyStep1"></div>
                    }
                    <KpiRow>
                        <GridLoadKpi
                            currentValue={currentKpis && currentKpis.gridLoad_r * 100}
                            previousValue={previousKpis && previousKpis.gridLoad_r * 100}
                        />
                        <CostKpi
                            currentValue={currentKpis && currentKpis.cost_eur}
                            previousValue={previousKpis && previousKpis.cost_eur}
                        />
                        <SustainabilityKpi
                            currentValue={currentKpis && currentKpis.sustainability_r * 100}
                            previousValue={previousKpis && previousKpis.sustainability_r * 100}
                        />
                    </KpiRow>
                </div>
            </TwoColumnSimulationLayout>
        </div>
    )
}
