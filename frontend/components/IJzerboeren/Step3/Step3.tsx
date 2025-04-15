import { TwoColumnSimulationLayout } from "@/components/Blocks/SectionBlock/TwoColumn"
import { HeatingType } from "@/components/IJzerboeren/HeatingType/heating-type"
import { HeatingTypeRadios } from "@/components/IJzerboeren/HeatingType/HeatingTypeRadios"
import { CO2EmissionKPI } from "@/components/IJzerboeren/KPIs/CO2EmissionKPI"
import { GelijktijdigheidKpi } from "@/components/IJzerboeren/KPIs/GelijktijdigheidKPI"
import { KpiRow } from "@/components/IJzerboeren/KPIs/KpiRow"
import { LCOEVerwarmen } from "@/components/IJzerboeren/KPIs/LCOEVerwarmen"
import { IronPowderSankey } from "@/components/IJzerboeren/Sankey/dynamic-import"
import { stepShadow } from "@/components/IJzerboeren/Step1/Step1"
import { Step2Outputs } from "@/components/IJzerboeren/Step2/step2-data"
import { step3Data } from "@/components/IJzerboeren/Step3/step3-data"
import { useStateWithHistory } from "@/components/IJzerboeren/useStateWithHistory"
import rawHtml from "@/components/RawHtml/RawHtml.module.css"
import { findSingle } from "@/utils/arrayFindSingle"
import { FunctionComponent } from "react"

export const Step3: FunctionComponent = () => {
    const [heatingType, previousHeatingType, setHeatingType] =
        useStateWithHistory<HeatingType>(HeatingType.DISTRICT_HEATING)

    const currentOutputs = findSingle(step3Data, r => r.inputs.heatingType === heatingType).outputs
    const currentKpis = currentOutputs.kpis

    let previousOutputs: Nullable<Step2Outputs> = null
    if (previousHeatingType) {
        previousOutputs = step3Data.find(r => r.inputs.heatingType === previousHeatingType)?.outputs
    }
    const previousKpis = previousOutputs?.kpis

    return (
        <div className="holonContentContainer" css={stepShadow}>
            <TwoColumnSimulationLayout bottomRuler={false} style={{minHeight: "50rem"}}>
                <div className={rawHtml.Container}>
                    <p>Omdat een warmtenet op restwarmte hier niet mogelijk is, zou dit in potentie een geschikte casus
                        kunnen zijn voor een warmtenet op basis van ijzerpoederverbranding. Doordat de ijzerpoederverbrander 
                        lokaal geplaatst kan worden, zijn de transportverliezen in het warmtenet bovendien lager dan bij 
                        een aansluiting op een externe restwarmtebron. </p>
                    <HeatingTypeRadios
                        heatingType={heatingType}
                        setHeatingType={setHeatingType}
                        contentId="heatingTypeStep3"/>
                    <p>Als je de optie &apos;warmtenet met ijzerpoeder&apos; selecteert zie je vergelijkbare resultaten als
                        bij de optie &apos;warmtenet met restwarmte&apos;. Dit komt doordat de verandering plaatsvind in de
                        keten vóór de wpmomgem, en niet in de energiedynamieken binnen de huishoudens. Het grote verschil is 
                        echter dat dit warmtenet <em>wél</em> realiseerbaar is in de nieuwbouwwijk. In vergelijking met 
                        warmtepompen verlaagt het de netbelasting met bijna 30%, en ten opzichte van aardgas ligt de CO₂-
                        uitstoot van de woningen bijna 40% lager. </p>
                    <p>Ook het kostenplaatje speelt een belangrijke rol. Hoewel de LCOE voor warmtesystemen sterk
                        afhankelijk is van de specifieke situatie, hebben we voor restwarmte, warmtepompen, en gas, 
                        respectievelijk, de kentallen 0.22, 0.12, en 0.15 euro/kWh gebruikt. Voor ijzerpoeder maken we gebruikt
                        van we de <a href="https://ipa-app-v7-fqf7fkg4fvf3ezcd.canadacentral-01.azurewebsites.net/v8/home">ijzerpoeder rekentool (IPA tool)</a> ontwikkeld binnen het TSE project 
                        &apos;Met Energie de Boer Op&apos;. Daarbij komt de LCEO van verwarmen met ijzerpoeder uit op circa 
                        0.17 eruo/kWh. Daarnaast houden we rekening met een aanvullende 0.03 euro/kWh voor de lokale infra-
                        structuur</p>
                    <img src="/imgs/lcoe-ijzerpoeder.png" alt="LCOE opbouw van warmte opwekken met ijzerpoeder" style={{
                        boxShadow: "-1px 1px 10px 0px lightgrey",
                    }}/>
                    <p></p>
                    <p>Geïnteresseerden raden we aan om de <a href="https://example.org">IPA tool</a> te verkennen. Daar
                        kunnen verschillende systeemconfiguraties voor de productie van ijzerpoeder in detail verkend en geoptimaliseerd
                        worden.</p>
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
