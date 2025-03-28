import {KpiRow} from "@/components/IJzerboeren/KPIs/KpiRow"
import {HeatingTypeRadios} from "@/components/IJzerboeren/HeatingType/HeatingTypeRadios"
import {step2Data, Step2Outputs} from "@/components/IJzerboeren/Step2/step2-data"
import {useStateWithHistory} from "@/components/IJzerboeren/useStateWithHistory"
import {TwoColumnSimulationLayout} from "@/components/Blocks/SectionBlock/TwoColumn"
import {FunctionComponent} from "react"
import {GelijktijdigheidKpi} from "@/components/IJzerboeren/KPIs/GelijktijdigheidKPI"
import {LCOEVerwarmen} from "@/components/IJzerboeren/KPIs/LCOEVerwarmen"
import {CO2EmissionKPI} from "@/components/IJzerboeren/KPIs/CO2EmissionKPI"
import {HeatingType} from "@/components/IJzerboeren/HeatingType/heating-type"
import rawHtml from "@/components/RawHtml/RawHtml.module.css"
import {IronPowderSankey} from "@/components/IJzerboeren/Sankey/dynamic-import"
import {findSingle} from "@/utils/arrayFindSingle"
import {stepShadow} from "@/components/IJzerboeren/Step1/Step1"

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
                    <p>De gemeente wil graag verkennen hoe andere oplossingen zouden presteren voor de 50 nieuwbouw
                        woningen. Zowel gas als een warmtenet kun je hier instellen om de (net)situatie te vergelijken
                        met het warmtepomp scenario.</p>

                    <HeatingTypeRadios
                        heatingType={heatingType}
                        setHeatingType={setHeatingType}
                        options={[
                            HeatingType.GAS_BURNER,
                            HeatingType.HEAT_PUMP,
                            HeatingType.DISTRICT_HEATING,
                        ]}
                        contentId="heatingTypeStep2"/>

                    <p>Aan de CO2 uitstoot KPI kun je zien waarom we in Nederland niet doorgaans niet meer voor gas
                        kiezen. De CO2 uitstoot verdubbeld bijna ten opzichte van het warmtepomp scenario. De
                        gelijktijdigheid gaat echter wel flink omlaag, wat de bouw van de wijk mogelijk maakt.</p>

                    <p>Het warmtenet met restwarmte lijkt alle voordelen te bieden die de bouw van de wijken mogelijk
                        maakt. Lage netcongestie en lage CO2 uitstoot. Hierbij rekenen we voor restwarmte in dit geval
                        geen CO2 uitstoot mee, hoe realistisch dat is staat ter discussie. Echter, er moet hoe dan ook
                        restwarmte beschikbaar zijn voor een dergelijke oplossing. De gemeente heeft een inventarisatie
                        gedaan van mogelijke bronnen in de omgeving, en er blijkt helaas niet voldoende restwarmte
                        dichtbij Cranendonck te zijn. Daar komt bij dat ook de prijs voor de consument van restwarmte
                        vaak niet de meest gunstige is.</p>
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
