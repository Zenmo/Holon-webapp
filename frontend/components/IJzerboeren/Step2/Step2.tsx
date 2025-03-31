import { TwoColumnSimulationLayout } from "@/components/Blocks/SectionBlock/TwoColumn"
import { HeatingType } from "@/components/IJzerboeren/HeatingType/heating-type"
import { HeatingTypeRadios } from "@/components/IJzerboeren/HeatingType/HeatingTypeRadios"
import { CO2EmissionKPI } from "@/components/IJzerboeren/KPIs/CO2EmissionKPI"
import { GelijktijdigheidKpi } from "@/components/IJzerboeren/KPIs/GelijktijdigheidKPI"
import { KpiRow } from "@/components/IJzerboeren/KPIs/KpiRow"
import { LCOEVerwarmen } from "@/components/IJzerboeren/KPIs/LCOEVerwarmen"
import { IronPowderSankey } from "@/components/IJzerboeren/Sankey/dynamic-import"
import { stepShadow } from "@/components/IJzerboeren/Step1/Step1"
import { step2Data, Step2Outputs } from "@/components/IJzerboeren/Step2/step2-data"
import { useStateWithHistory } from "@/components/IJzerboeren/useStateWithHistory"
import rawHtml from "@/components/RawHtml/RawHtml.module.css"
import { findSingle } from "@/utils/arrayFindSingle"
import { FunctionComponent } from "react"

export const Step2: FunctionComponent = () => {
    const [heatingType, previousHeatingType, setHeatingType] =
        useStateWithHistory<HeatingType>(HeatingType.HEAT_PUMP)

    const currentOutputs = findSingle(step2Data, r => r.inputs.heatingType === heatingType).outputs
    const currentKpis = currentOutputs.kpis

    let previousOutputs: Nullable<Step2Outputs> = null
    if (previousHeatingType) {
        previousOutputs = step2Data.find(r => r.inputs.heatingType === previousHeatingType)?.outputs
    }
    const previousKpis = previousOutputs?.kpis

    return (
        <div className="holonContentContainer" css={stepShadow}>
            <TwoColumnSimulationLayout bottomRuler={false} style={{minHeight: "50rem"}}>
                <div className={rawHtml.Container}>
                    <p>Om de gemeente te helpen met het verkennen van de prestatie van de andere warmteoplossingen kun je
                        hieronder de opties 'gas' en 'warmtenet met restwarmte' instellen en vergelijken met de 
                        (net)situatie van het warmtepomp scenario.</p>

                    <HeatingTypeRadios
                        heatingType={heatingType}
                        setHeatingType={setHeatingType}
                        options={[
                            HeatingType.GAS_BURNER,
                            HeatingType.HEAT_PUMP,
                            HeatingType.DISTRICT_HEATING,
                        ]}
                        contentId="heatingTypeStep2"/>

                    <p>Aan de CO2 uitstoot KPI kun je zien waarom we in Nederland doorgaans niet meer voor gas
                        kiezen. De CO2 uitstoot bij gas ligt bijna 40% hoger dan met warmtepompen. Een groot deel
                        van die uitstoot is overigens het resultaat van de 70% benzine auto's bij woningen die in 
                        elk scenario hetzelfde blijft. De gelijktijdigheid bij gas gaat echter wel flink omlaag.
                        Dit betekent dat het de bouw van de wijk wel mogelijk maakt, een zeer belangrijk criterium.</p>

                    <p>De optie 'warmtenet met restwarmte' lijkt de voordelen te bieden die de bouw van de wijken 
                        mogelijk maakt. Lage netcongestie en lage CO2 uitstoot. Voor restwarmte rekenen we geen CO2 
                        uitstoot mee, dat is mogelijk niet op alle situaties van toepassing. Echter, er moet hoe dan ook
                        restwarmte beschikbaar zijn voor een dergelijke oplossing. De gemeente heeft een inventarisatie
                        gedaan van mogelijke bronnen in de omgeving, maar er blijkt helaas niet voldoende restwarmte
                        in de nabijheid Cranendonck te zijn. Daar komt bij dat de prijs van restwarmte voor de consument 
                        niet het meest gunstige is.</p>
                </div>
                <div style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
                    <div style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}>
                        <IronPowderSankey links={currentOutputs.sankey} />
                    </div>
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
