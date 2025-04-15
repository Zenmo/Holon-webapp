import { TwoColumnSimulationLayout } from "@/components/Blocks/SectionBlock/TwoColumn"
import { CO2EmissionKPI } from "@/components/IJzerboeren/KPIs/CO2EmissionKPI"
import { GelijktijdigheidKpi } from "@/components/IJzerboeren/KPIs/GelijktijdigheidKPI"
import { KpiRow } from "@/components/IJzerboeren/KPIs/KpiRow"
import { LCOEVerwarmen } from "@/components/IJzerboeren/KPIs/LCOEVerwarmen"
import { IronPowderSankey } from "@/components/IJzerboeren/Sankey/dynamic-import"
import { heatPumpKpis, heatPumpSankeyLinks } from "@/components/IJzerboeren/Step1/step-1-data"
import rawHtml from "@/components/RawHtml/RawHtml.module.css"
import { css } from "@emotion/react"
import { FunctionComponent } from "react"

export const stepShadow = css({
    boxShadow: "-1px 1px 5px 2px #ddd",
    marginBottom: "2rem",
})

export const Step1: FunctionComponent = () => {
    return (
        <div className="holonContentContainer" css={stepShadow}>
            <TwoColumnSimulationLayout bottomRuler={false} style={{minHeight: "50rem"}}>
                <div className={rawHtml.Container}>
                    <p>
                        Welkom in de buurt &apos;Cranendonck&apos; in Budel. Als onderdeel van de woonopgave heeft de gemeente
                        hier een locatie gereserveerd om 50 woningen te bouwen met de volgende eigenschappen: </p>

                    <ul>
                        <li>8 vrijstaande woningen, 18 twee-onder-één-kap woningen, 24 appartementen</li>
                        <li>Alle woningen worden goed geïsoleerd</li>
                        <li>Zonnepanelen op alle (2 tot 4 kWp per woning)</li>
                        <li>30% van de huizen met elektrische auto&apos;s</li>
                    </ul>

                    <p>Voor het warmtesysteem van deze woningen staat de gemeente voor een uitdaging. Normaliter zou er gekozen
                        worden voor warmtepompen, maar Enexis heeft aangegeven dat het elektriciteitsnet niet voldoende capaciteit 
                        heeft om de volledige woonopgave te realiseren met volledig geëlektrificeerde nieuwbouwhuizen Daarom wil 
                        de gemeente beter inzicht in de verschillen tussen opties voor warmtesystemen — én wat die keuzes zouden 
                        betekenen voor bewoners, bijvoorbeeld qua energiekosten.. Deze casus op holontool.nl zal die inzichten 
                        bieden. Laten we beginnen met het verkennen van het scenario waarbij alle woningen gebruikmaken van 
                        warmtepompen voor ruimteverwarming en warm tapwater. </p>

                    <p>Het holon-model is, net als in de andere casussen, gebruikt om het energiesysteem van deze casus op 
                        kwartierbasis door te rekenen, hierbij is echte data van woningen gebruikt. Bekijk hier rechts
                        de stromingsdiagram waarin alle energiedragers en de gebruiksdoelen voor deze 50 woningen
                        worden gekwanitficeerd. Met je muis kun je de waarde van ieder blok in de diagram bekijken. </p>

                    <p>Voor deze casus zijn drie KPIs gedefinieerd:</p>
                    <ol>
                        <li>de piek van de gelijktijdige netbelasting per woning,</li>
                        <li>de kosten voor verwarming per kWh (uitgedrukt in levelized cost of energy, LCOE), en</li>
                        <li>de totale CO2 uitstoot van alle 50 woningen samen. </li>
                    </ol>

                    <p>Verken de stromings-diagram en de KPIs goed. In de volgende stappen gaan we die vergelijken met
                        andere scenario&apos;s.
                    </p>
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
                        <IronPowderSankey links={heatPumpSankeyLinks} />
                    </div>
                    <KpiRow>
                        <GelijktijdigheidKpi currentValue={heatPumpKpis.gelijktijdigheid_kW} />
                        <LCOEVerwarmen currentValue={heatPumpKpis.lcoeVerwarmen_eurocentpkWh} />
                        <CO2EmissionKPI currentValue={heatPumpKpis.co2emission_t} />
                    </KpiRow>
                </div>
            </TwoColumnSimulationLayout>
        </div>
    )
}
