import { KpiRow } from "@/components/IJzerboeren/KPIs/KpiRow"
import {heatPumpKpis, heatPumpSankeyLinks} from "@/components/IJzerboeren/Step1/step-1-data"
import {TwoColumnSimulationLayout} from "@/components/Blocks/SectionBlock/TwoColumn"
import {FunctionComponent} from "react"
import {GelijktijdigheidKpi} from "@/components/IJzerboeren/KPIs/GelijktijdigheidKPI"
import {LCOEVerwarmen} from "@/components/IJzerboeren/KPIs/LCOEVerwarmen"
import {CO2EmissionKPI} from "@/components/IJzerboeren/KPIs/CO2EmissionKPI"
import rawHtml from "@/components/RawHtml/RawHtml.module.css"
import {IronPowderSankey} from "@/components/IJzerboeren/Sankey/dynamic-import"

export const Step1: FunctionComponent = () => {
    return (
        <div className="holonContentContainer">
            <TwoColumnSimulationLayout style={{minHeight: "50rem"}}>
                <div className={rawHtml.Container}>
                    <p>
                        Welkom in de buurt &apos;Cranendonck&apos; in Budel. Als onderdeel van de woonopgave heeft de gemeente
                        hier een locatie gereserveerd om 50 huizen te bouwen met de volgende eigenschappen: </p>

                    <ul>
                        <li>8 vrijstaande huizen, 18 twee-onder-één-kap woningen, 24 appartementen</li>
                        <li>Alle woningen goed geïsoleerd</li>
                        <li>Alle daken met zonnepanelen (2 tot 4 kWp per woning)</li>
                        <li>Ze verwachten ongeveer 30% elektrische auto&apos;s</li>
                    </ul>

                    <p>Voor het warmtesysteem van deze huizen hebben ze echter een probleem. Normaliter zouden ze voor
                        warmtepompen gaan. Maar Enexis heeft aangegeven dat er niet voldoende netruimte is volledige
                        woonopgave te voldoen met nieuwbouwhuizen met warmtepompen, EVs en zonnepanelen. Daarom wil de
                        gemeente beter inzicht in wat de verschillende warmte systemen energetisch voor impact hebben en
                        ook wat het betekent voor de bewoners in termen van energiekosten. Die gewenste inzichten zal
                        deze casus geven. Laten we beginnen met de situatie waarin alle huizen wel warmtepompen
                        gebruiken voor verwarming en warm water. </p>

                    <p>Met het holon-model is deze casus op basis van veel echte data doorberekend. Bekijk hier rechts
                        het stromings-diagram waarin alle energiedragers en de gebruiksdoelen voor deze 50 woningen
                        worden gekwanitficeerd. </p>

                    <p>Voor deze casus hebben we tevens drie KPIs gedefinieerd:</p>
                    <ol>
                        <li>de piek van de gelijktijdige netbelasting per huis,</li>
                        <li>de kosten voor verwarming per kWh (uitgedrukt in levelized cost of energy, LCOE), en</li>
                        <li>de totale CO2 uitstoot alle 50 woningen samen. </li>
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
