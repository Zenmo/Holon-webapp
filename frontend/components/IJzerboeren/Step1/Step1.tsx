import { KpiRow } from "@/components/IJzerboeren/KpiRow"
import { GridLoadKpi } from "@/components/KPIDashboard/KpiItems/GridLoadKpi"
import { CostKpi } from "@/components/KPIDashboard/KpiItems/CostKpi"
import { SustainabilityKpi } from "@/components/KPIDashboard/KpiItems/SustainabilityKpi"
import { HeatingTypeRadios } from "@/components/IJzerboeren/Step1/HeatingTypeRadios"
import { HeatingType, step1Data, Step1Outputs } from "@/components/IJzerboeren/Step1/step-1-data"
import { useStateWithHistory } from "@/components/IJzerboeren/useStateWithHistory"
import {TwoColumnSimulationLayout} from "@/components/Blocks/SectionBlock/TwoColumn"
import {FunctionComponent} from "react"

export const Step1: FunctionComponent = () => {
    const [heatingType, previousHeatingType, setHeatingType] =
        useStateWithHistory<HeatingType | null>(null)

    let currentOutputs: Nullable<Step1Outputs> = null
    if (heatingType) {
        currentOutputs = step1Data.find(r => r.inputs.heatingType === heatingType)?.outputs
    }

    let previousOutputs: Nullable<Step1Outputs> = null
    if (previousHeatingType) {
        previousOutputs = step1Data.find(r => r.inputs.heatingType === previousHeatingType)?.outputs
    }

    return (
        <TwoColumnSimulationLayout>
            <div>
                <p>Hier een mooi verhaal over wat de afwegingen zijn bij het kiezen voor een energiesysteem</p>
                <HeatingTypeRadios setHeatingType={setHeatingType} />
            </div>
            <div style={{
                flexDirection: "column-reverse",
            }}>
                <KpiRow>
                    <GridLoadKpi
                        currentValue={currentOutputs && currentOutputs.gridLoad_r * 100}
                        previousValue={previousOutputs && previousOutputs.gridLoad_r * 100}
                    />
                    <CostKpi
                        currentValue={currentOutputs && currentOutputs.cost_eur}
                        previousValue={previousOutputs && previousOutputs.cost_eur}
                    />
                    <SustainabilityKpi
                        currentValue={currentOutputs && currentOutputs.sustainability_r * 100}
                        previousValue={previousOutputs && previousOutputs.sustainability_r * 100}
                    />
                </KpiRow>
            </div>
        </TwoColumnSimulationLayout>
    )
}
