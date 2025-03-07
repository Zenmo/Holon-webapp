import { KpiRow } from "@/components/IJzerboeren/KpiRow"
import { GridLoadKpi } from "@/components/KPIDashboard/KpiItems/GridLoadKpi"
import { CostKpi } from "@/components/KPIDashboard/KpiItems/CostKpi"
import { SustainabilityKpi } from "@/components/KPIDashboard/KpiItems/SustainabilityKpi"
import { HeatingTypeRadios } from "@/components/IJzerboeren/Step1/HeatingTypeRadios"
import {HeatingType, step1Data, Step1Outputs} from "@/components/IJzerboeren/Step1/step-1-data"
import { useStateWithHistory } from "@/components/IJzerboeren/useStateWithHistory"
import {TwoColumnSimulationLayout} from "@/components/Blocks/SectionBlock/TwoColumn"
import {FunctionComponent} from "react"
import dynamic from 'next/dynamic'

// This prevents an issue with server-side rendering
const IronPowderSankey = dynamic(
    () => import('../Sankey/Sankey').then(res => res.IronPowderSankey),
    { ssr: false }
)

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

    return (
        <div className="holonContentContainer">
            <TwoColumnSimulationLayout style={{minHeight: "50rem"}}>
                <div>
                    <p>Hier een mooi verhaal over wat de afwegingen zijn bij het kiezen voor een verwarmingssysteem</p>
                    <HeatingTypeRadios setHeatingType={setHeatingType} />
                </div>
                <div style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
                    {currentOutputs &&
                        <IronPowderSankey links={currentOutputs.sankey} />
                    }
                    <div></div>
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
