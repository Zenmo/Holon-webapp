import {KpiRow} from "@/components/IJzerboeren/KPIs/KpiRow"
import {HeatingTypeRadios} from "@/components/IJzerboeren/HeatingType/HeatingTypeRadios"
import {Step2Outputs} from "@/components/IJzerboeren/Step2/step2-data"
import {useStateWithHistory} from "@/components/IJzerboeren/useStateWithHistory"
import {TwoColumnSimulationLayout} from "@/components/Blocks/SectionBlock/TwoColumn"
import {FunctionComponent} from "react"
import dynamic from "next/dynamic"
import {GelijktijdigheidKpi} from "@/components/IJzerboeren/KPIs/GelijktijdigheidKPI"
import {LCOEVerwarmen} from "@/components/IJzerboeren/KPIs/LCOEVerwarmen"
import {CO2EmissionKPI} from "@/components/IJzerboeren/KPIs/CO2EmissionKPI"
import {step3Data} from "@/components/IJzerboeren/Step3/step3-data"
import {HeatingType} from "@/components/IJzerboeren/HeatingType/heating-type"
import rawHtml from "@/components/RawHtml/RawHtml.module.css"

// This prevents an issue with server-side rendering
const IronPowderSankey = dynamic(
    () => import('../Sankey/Sankey').then(res => res.IronPowderSankey),
    { ssr: false }
)

export const Step3: FunctionComponent = () => {
    const [heatingType, previousHeatingType, setHeatingType] =
        useStateWithHistory<HeatingType>(HeatingType.HEAT_PUMP)

    let currentOutputs: Nullable<Step2Outputs> = null
    if (heatingType) {
        currentOutputs = step3Data.find(r => r.inputs.heatingType === heatingType)?.outputs
    }
    const currentKpis = currentOutputs?.kpis

    let previousOutputs: Nullable<Step2Outputs> = null
    if (previousHeatingType) {
        previousOutputs = step3Data.find(r => r.inputs.heatingType === previousHeatingType)?.outputs
    }
    const previousKpis = previousOutputs?.kpis

    return (
        <div className="holonContentContainer">
            <TwoColumnSimulationLayout style={{minHeight: "50rem"}}>
                <div className={rawHtml.Container}>
                    <HeatingTypeRadios
                        heatingType={heatingType}
                        setHeatingType={setHeatingType} c
                        ontentId="heatingTypeStep3" />
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
                        <GelijktijdigheidKpi
                            currentValue={currentKpis && currentKpis.gelijktijdigheid_kW}
                            previousValue={previousKpis && previousKpis.gelijktijdigheid_kW}
                        />
                        <LCOEVerwarmen
                            currentValue={currentKpis && currentKpis.lcoeVerwarmen_eurocentpkWh}
                            previousValue={previousKpis && previousKpis.lcoeVerwarmen_eurocentpkWh}
                        />
                        <CO2EmissionKPI
                            currentValue={currentKpis && currentKpis.co2emission_t}
                            previousValue={previousKpis && previousKpis.co2emission_t}
                        />
                    </KpiRow>
                </div>
            </TwoColumnSimulationLayout>
        </div>
    )
}
