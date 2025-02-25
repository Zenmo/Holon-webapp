import React, {FunctionComponent} from "react"
import {calcChangeDirection, ChangeAppreciation} from "@/components/KPIDashboard/ChangeIcon"
import {KpiDisplay} from "@/components/KPIDashboard/KpiItems/KpiDisplay"
import {KpiDisplayProps} from "@/components/KPIDashboard/KpiItems/types"
import {formatCurrentKpiNumber, formatPreviousKpiNumber} from "@/components/KPIDashboard/KpiItems/number-format"

export const SustainabilityKpi: FunctionComponent<KpiDisplayProps> = ({view, currentValue, previousValue}) => {
    return (
        <KpiDisplay
            view={view}
            title="Duurzaamheid"
            label="sustainability"
            changeDirection={calcChangeDirection(previousValue, currentValue)}
            changeAppreciation={ChangeAppreciation.MORE_IS_BETTER}
            previousValue={formatPreviousKpiNumber(previousValue)}
            value={formatCurrentKpiNumber(currentValue)}
            unit="%"
            description="De indicator duurzaamheid staat voor het percentage duurzame energie van het totale energieverbruik in het gemodelleerde gebied."
        />
    )
}
