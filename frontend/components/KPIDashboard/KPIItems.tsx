import React from "react"
import { KpiView } from "./KpiItems/KpiDisplay"
import styles from "./kpi.module.css"
import { KPIsByScale, Level } from "@/api/holon"
import { GridLoadKpi } from "@/components/KPIDashboard/KpiItems/GridLoadKpi"
import { CostKpi } from "@/components/KPIDashboard/KpiItems/CostKpi"
import { SustainabilityKpi } from "@/components/KPIDashboard/KpiItems/SustainabilityKpi"
import { SelfSufficiencyKpi } from "@/components/KPIDashboard/KpiItems/SelfSufficiencyKpi"

type KPIItems = {
    view: KpiView
    previousData: KPIsByScale
    data: KPIsByScale
    level: Level
    loading: boolean
}

export default function KPIItems({ view, previousData, data, level }: KPIItems) {
    return (
        <React.Fragment>
            {data[level] ?
                <React.Fragment>
                    <GridLoadKpi
                        view={view}
                        currentValue={data[level].netload}
                        previousValue={previousData[level].netload}
                    />
                    <CostKpi
                        view={view}
                        currentValue={data[level].costs}
                        previousValue={previousData[level].costs}
                    />
                    <SustainabilityKpi
                        view={view}
                        currentValue={data[level].sustainability}
                        previousValue={previousData[level].sustainability}
                    />
                    <SelfSufficiencyKpi
                        view={view}
                        currentValue={data[level].selfSufficiency}
                        previousValue={previousData[level].selfSufficiency}
                    />
                </React.Fragment>
            :   <span className={styles[view]}>Er is geen data op dit niveau.</span>}
        </React.Fragment>
    )
}
