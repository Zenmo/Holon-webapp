import React, {FunctionComponent} from "react"
import {KpiDisplayProps} from "@/components/KPIDashboard/KpiItems/types"
import {KpiDisplay} from "@/components/KPIDashboard/KpiItems/KpiDisplay"
import {calcChangeDirection, ChangeAppreciation} from "@/components/KPIDashboard/ChangeIcon"
import {formatCurrentKpiNumber, formatPreviousKpiNumber} from "@/components/KPIDashboard/KpiItems/number-format"

export const CO2EmissionKPI: FunctionComponent<KpiDisplayProps> = ({
    previousValue,
    currentValue,
    view,
}) => {
    return (
        <KpiDisplay
            view={view}
            title="Emissies"
            label="sustainability"
            changeDirection={calcChangeDirection(previousValue, currentValue)}
            changeAppreciation={ChangeAppreciation.MORE_IS_WORSE}
            previousValue={formatPreviousKpiNumber(previousValue)}
            value={formatCurrentKpiNumber(currentValue)}
            unit="ton CO2"
            description=""
        />
    )
}
