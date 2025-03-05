import InteractiveInputPopover from "@/components/InteractiveInputs/InteractiveInputPopover"
import { ComponentProps } from "react"

type RadioButtons = {
    updateValue: (value: string) => void
    loading: boolean
    dashboardId: string
} & ComponentProps<"div">

export default function KPIRadioButtons({
    updateValue,
    loading,
    dashboardId,
    ...props
}: RadioButtons) {
    return (
        <div
            {...props}
            style={{
                display: "flex",
                flexDirection: "column-reverse",
                ...props.style,
            }}
        >
            <label
                htmlFor={`${dashboardId}-lokaal`}
                className="flex flex-row mb-2"
                style={{
                    alignItems: "center",
                }}
            >
                <input
                    defaultChecked={true}
                    type="radio"
                    name={`${dashboardId}-lokaal-nationaal`}
                    value="local"
                    id={`${dashboardId}-lokaal`}
                    data-testid="radio-local"
                    onChange={e => updateValue(e.target.value)}
                    disabled={loading ? true : false}
                    className={`rounded-full after:checked:content-['●'] after:mt-[-2px] flex h-5 w-5 appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500 disabled:checked:bg-gray-500 disabled:border-gray-700`}
                />
                <span className="mr-auto ml-4">Lokale KPI&apos;s</span>
                <InteractiveInputPopover
                    data-class="kpiInfo"
                    textColor="text-holon-blue-900"
                    name="Lokale KPI's"
                    moreInformation="Geeft de resultaten (KPI's) weer van de agent-based simulatie van het gebied. Het gedrag van de verschillende actoren wordt hiervoor opgeteld over het hele jaar."
                    // This link is brittle since it is a reference to content in the CMS.
                    linkWikiPage={
                        "wiki/gebruikershandleiding/5-simulatiemodel/algemene-introductie/"
                    }
                    target="_blank"
                />
            </label>

            <label
                htmlFor={`${dashboardId}-regionaal`}
                className="flex flex-row mb-2"
                style={{
                    alignItems: "center",
                }}
            >
                <input
                    type="radio"
                    name={`${dashboardId}-lokaal-nationaal`}
                    value="intermediate"
                    id={`${dashboardId}-regionaal`}
                    data-testid="radio-intermediate"
                    onChange={e => updateValue(e.target.value)}
                    disabled={loading ? true : false}
                    className={`rounded-full after:checked:content-['●'] after:mt-[-2px] flex h-5 w-5 appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500 disabled:checked:bg-gray-500 disabled:border-gray-700`}
                />
                <span className="mr-auto ml-4">Regionale KPI&apos;s</span>
                <InteractiveInputPopover
                    data-class="kpiInfo"
                    textColor="text-holon-blue-900"
                    name="Regionale KPI's"
                    moreInformation="De resultaten van het lokale gedrag worden opgeschaald naar een relevant tussenniveau zoals een gemeente of een provincie. Dit gebeurt middels het Energietransitiemodel (ETM). In de documentatie leest u meer over welke aannames zijn gedaan voor de opschaling naar regionale KPI's."
                    // This link is brittle since it is a reference to content in the CMS.
                    linkWikiPage={
                        "wiki/gebruikershandleiding/3-key-perfomance-indicatoren/kpis-op-regionaal-en-nationaal-niveau/"
                    }
                    target="_blank"
                />
            </label>

            <label
                htmlFor={`${dashboardId}-nationaal`}
                className="flex flex-row mb-2"
                style={{
                    alignItems: "center",
                }}
            >
                <input
                    type="radio"
                    name={`${dashboardId}-lokaal-nationaal`}
                    value="national"
                    id={`${dashboardId}-nationaal`}
                    data-testid="radio-national"
                    onChange={e => updateValue(e.target.value)}
                    disabled={loading ? true : false}
                    className={`rounded-full after:checked:content-['●'] after:mt-[-2px] flex h-5 w-5 appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500 disabled:checked:bg-gray-500 disabled:border-gray-700`}
                />
                <span className="mr-3 ml-4">Nationale KPI&apos;s</span>
                <InteractiveInputPopover
                    data-class="kpiInfo"
                    textColor="text-holon-blue-900"
                    name="Nationale KPI's"
                    moreInformation="De resultaten van het lokale gedrag worden opgeschaald naar landelijk niveau middels het Energietransitiemodel (ETM). In de documentatie leest u meer over welke aannames zijn gedaan voor de opschaling naar nationale KPI's."
                    // This link is brittle since it is a reference to content in the CMS.
                    linkWikiPage={
                        "wiki/gebruikershandleiding/3-key-perfomance-indicatoren/kpis-op-regionaal-en-nationaal-niveau/"
                    }
                    target="_blank"
                />
            </label>
        </div>
    )
}
