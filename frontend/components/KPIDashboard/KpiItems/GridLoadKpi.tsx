import React, {FunctionComponent} from "react"
import {KpiDisplay} from "@/components/KPIDashboard/KpiItems/KpiDisplay"
import {calcChangeDirection, ChangeAppreciation} from "@/components/KPIDashboard/ChangeIcon"
import {formatCurrentKpiNumber, formatPreviousKpiNumber} from "@/components/KPIDashboard/KpiItems/number-format"
import {KpiDisplayProps} from "@/components/KPIDashboard/KpiItems/types"

export const GridLoadKpi: FunctionComponent<KpiDisplayProps> = ({previousValue, currentValue, view}) => {
    return (
        <KpiDisplay
            view={view}
            title="Netbelasting"
            label="netload"
            changeDirection={calcChangeDirection(abs(previousValue), abs(currentValue))}
            changeAppreciation={ChangeAppreciation.MORE_IS_WORSE}
            previousValue={formatPreviousKpiNumber(previousValue)}
            value={formatCurrentKpiNumber(currentValue)}
            unit="%"
            description="Deze indicator geeft de maximale belasting gedurende het jaar als percentage van het transformatorvermogen weer. Een negatieve netbelasting geeft aan dat de maximale belasting optreedt wanneer er een lokaal overschot aan energie is."
        />
    )
}

/**
 * Math.abs doesn't handle null like it should
 */
function abs(value: Nullable<number>) {
    if (typeof value !== "number") {
        return NaN
    }

    return Math.abs(value)
}
