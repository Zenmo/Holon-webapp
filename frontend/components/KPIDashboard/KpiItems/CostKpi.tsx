import React, { FunctionComponent } from "react"
import { KpiDisplayProps } from "@/components/KPIDashboard/KpiItems/types"
import { calcChangeDirection, ChangeAppreciation } from "@/components/KPIDashboard/ChangeIcon"
import { KpiDisplay } from "@/components/KPIDashboard/KpiItems/KpiDisplay"
import { formatKpiNumber } from "@/components/KPIDashboard/KpiItems/number-format"
import { isNumber } from "lodash"

export const CostKpi: FunctionComponent<KpiDisplayProps> = ({
    view,
    currentValue,
    previousValue,
}) => {
    return (
        <KpiDisplay
            view={view}
            title="Betaalbaarheid"
            label="costs"
            changeDirection={calcChangeDirection(previousValue, currentValue)}
            changeAppreciation={ChangeAppreciation.MORE_IS_WORSE}
            previousValue={formatCosts(previousValue, "").value}
            value={formatCosts(currentValue).value}
            unit={formatCosts(currentValue).multiplier + "€/jaar"}
            previousUnit={formatCosts(previousValue).multiplier + "€/jaar"}
            description="Op lokaal niveau geeft deze indicator de totale jaarlijkse kosten voor de energievoorziening van het gesimuleerde gebied (EUR/jaar) weer."
        />
    )
}

function formatCosts(value: Nullable<number>, empty = "-") {
    let multiplier = ""

    if (!isNumber(value)) {
        return {
            value: "",
            multiplier,
        }
    }

    if (value > 1e9) {
        value = value / 1e9
        multiplier = "mld."
    } else if (value > 1e6) {
        value = value / 1e6
        multiplier = "mln."
    } else if (value > 1e3) {
        value = value / 1e3
        multiplier = "k."
    }

    return {
        value: formatKpiNumber(value, empty),
        multiplier,
    }
}
