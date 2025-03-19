import React, {FunctionComponent} from "react"
import {KpiDisplayProps} from "@/components/KPIDashboard/KpiItems/types"
import {KpiDisplay} from "@/components/KPIDashboard/KpiItems/KpiDisplay"
import {calcChangeDirection, ChangeAppreciation} from "@/components/KPIDashboard/ChangeIcon"
import {formatCurrentKpiNumber, formatPreviousKpiNumber} from "@/components/KPIDashboard/KpiItems/number-format"

export const LCOEVerwarmen: FunctionComponent<KpiDisplayProps> = ({
    previousValue,
    currentValue,
    view,
}) => {
    return (
        <KpiDisplay
            view={view}
            title="LCOE verwarmen"
            label="costs"
            changeDirection={calcChangeDirection(previousValue, currentValue)}
            changeAppreciation={ChangeAppreciation.MORE_IS_WORSE}
            previousValue={formatPreviousKpiNumber(previousValue)}
            value={formatCurrentKpiNumber(currentValue)}
            unit="eurocent/kWh"
            description={`
                LCOE staat voor Levelized Cost Of Energy.
                Dit geeft de kosten weer rekening houdend met alle factoren,
                inclusief de financieringskosten en de levensduur van investeringen.
            `}
        />
    )
}
