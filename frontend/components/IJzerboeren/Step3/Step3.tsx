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
                    <p>Omdat een warmtenet op restwarmte hier niet mogelijk is, zou dit in potentie een geschikte casus
                        zijn voor een warmtenet met verbranding van ijzerpoeder. Doordat de verbrander van ijzerpoeder
                        in de buurt komt te staan zal het warmtenet minder transportverliezen hebben dan in de situatie
                        met restwarmte. </p>
                    <HeatingTypeRadios
                        heatingType={heatingType}
                        setHeatingType={setHeatingType}
                        contentId="heatingTypeStep3"/>
                    <p>Selecteer je de optie ‘warmtenet met ijzerpoeder’ dan zie je zeer vergelijkbare resultaten als
                        bij die van het warmtenet met restwarmte. Het verandert namelijk vooral de keten vooraf, niet de
                        dynamieken in de huishoudens. Het grote verschil is dat dit warmtenet wel te realiseren is in de
                        nieuwbouwwijk. Ten opzichte van de warmtepompen zal het de netbelasting met bijna 30% verlagen,
                        en ten opzichte van gas ligt de CO2 uitstoot van de huizen bijna 40% lager. </p>
                    <p>Als laatste is het kostenplaatje uiteraard belangrijk. Hoewel de LCOE voor warmtesystemen sterk
                        situatie afhankelijk is, hebben we voor restwarmte, warmtepompen, en gas, respectievelijk, de
                        kentallen 0.22, 0.12, en 0.15 euro/kWh gebruikt. Voor ijzerpoeder gebruiken we de
                        ijzerpoederketen rekentool (IPA tool – link) ontwikkelt in het TSE project ‘Met Energie de Boer
                        Op’. Daarbij komt de LCEO van verwarmen met ijzerpoeder uit op circa 0.17 eruo/kWh. Daar bovenop
                        houden we ook nog rekening met 0.03 euro/kWh voor de lokale infrastructuur</p>
                    <img src="/imgs/lcoe-ijzerpoeder.png" alt="LCOE opbouw van warmte opwekken met ijzerpoeder" />
                    <p></p>
                    <p>Voor de geintereseerde sturen raden we aan om de <a href="https://example.org">IPA tool</a> te verkennen. Daar kunnen verschillende
                        systeem configuraties voor de productie van ijzerpoeder in detail verkend en geoptimilaseerd
                        worden.</p>
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
