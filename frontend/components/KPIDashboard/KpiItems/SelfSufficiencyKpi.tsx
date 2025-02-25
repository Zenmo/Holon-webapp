import React, {FunctionComponent} from "react"
import {calcChangeDirection, ChangeAppreciation} from "@/components/KPIDashboard/ChangeIcon"
import {KpiDisplay} from "@/components/KPIDashboard/KpiItems/KpiDisplay"
import {KpiDisplayProps} from "@/components/KPIDashboard/KpiItems/types"
import {formatCurrentKpiNumber, formatPreviousKpiNumber} from "@/components/KPIDashboard/KpiItems/number-format"

export const SelfSufficiencyKpi: FunctionComponent<KpiDisplayProps> = ({view, currentValue, previousValue}) => {
    return (
        <KpiDisplay
            view={view}
            title="Zelfvoorzienendheid"
            label="selfSufficiency"
            changeDirection={calcChangeDirection(previousValue, currentValue)}
            changeAppreciation={ChangeAppreciation.MORE_IS_BETTER}
            previousValue={formatPreviousKpiNumber(previousValue)}
            value={formatCurrentKpiNumber(currentValue)}
            unit="%"
            description="De indicator zelfvoorzienendheid staat voor het percentage van het totale energieverbruik dat wordt ingevuld met eigen, gelijktijdige energieopwekking."
        />
    )
}
