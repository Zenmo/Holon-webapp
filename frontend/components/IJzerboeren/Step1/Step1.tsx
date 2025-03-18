import { KpiRow } from "@/components/IJzerboeren/KPIs/KpiRow"
import {sankeyLinks} from "@/components/IJzerboeren/Step1/step-1-data"
import {TwoColumnSimulationLayout} from "@/components/Blocks/SectionBlock/TwoColumn"
import {FunctionComponent} from "react"
import dynamic from 'next/dynamic'
import {GelijktijdigheidKpi} from "@/components/IJzerboeren/KPIs/GelijktijdigheidKPI"
import {LCOEVerwarmen} from "@/components/IJzerboeren/KPIs/LCOEVerwarmen"
import {CO2EmissionKPI} from "@/components/IJzerboeren/KPIs/CO2EmissionKPI"
import rawHtml from "@/components/RawHtml/RawHtml.module.css"

// Importing like this prevents an issue with server-side rendering
const IronPowderSankey = dynamic(
    () => import('../Sankey/Sankey').then(res => res.IronPowderSankey),
    { ssr: false }
)

export const Step1: FunctionComponent = () => {
    return (
        <div className="holonContentContainer">
            <TwoColumnSimulationLayout style={{minHeight: "50rem"}}>
                <div className={rawHtml.Container}>
                    <p>
                        Voor de 50 huizen heeft de gemeente Budel de volgende ontwikkelingsplannen met de ontwikkelaar
                        afgestemd:</p>

                    <ul>
                        <li>8 vrijstaande huizen, 18 twee-onder-één-kap woningen, 24 appartementen</li>
                        <li>Alle woningen goed geisoleerd</li>
                        <li>Alle daken met zonnepanelen (2 tot 4 kWp per woning)</li>
                        <li>Ze verwachten ongeveer 30% elektrische auto&apos;s</li>
                    </ul>

                    <p>Over de warmtesystemen zijn ze nog aan het twijfelen. Normaliter zouden ze voor warmtepompen
                        kiezen. Maar gezien de woonopgave en de congestieproblemen in de gemeente is het belangrijk om
                        de gelijktijdigheid van de netbelasting zo laag mogelijk houden. De gemeente wil daarom
                        verschillende opties verkennen. Wat betekenen de verschillende opties voor de netbelasting, voor
                        de duurzaamheid, en voor de kosten van de bewoners?</p>

                    <p>Hier rechts in het stromings-diagram kun je bekijken hoeveel energie en voor welk doeleind de
                        vijftig huizen consumeren als ze met warmtepompen zouden verwarmen. Ook kun je de drie
                        belangrijke KPI&apos;s van deze casus bekijken: de piek van de gelijktijdige netbelasting per huis,
                        de kosten voor verwarming per kWh (uitgedrukt in life-cycle cost of energy, LCOE), en de totale
                        CO2 uitstoot van de geconsumeerde energie door de woningen.</p>

                    <p>Bekijk het stromings-diagram en de KPIs goed. In de volgende stappen gaan we die vergelijken met
                        andere scenario&apos;s.
                    </p>
                </div>
                <div style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
                    <IronPowderSankey links={sankeyLinks} />
                    <div></div>
                    <KpiRow>
                        <GelijktijdigheidKpi currentValue={2.6} />
                        <LCOEVerwarmen currentValue={12} />
                        <CO2EmissionKPI currentValue={138} />
                    </KpiRow>
                </div>
            </TwoColumnSimulationLayout>
        </div>
    )
}
