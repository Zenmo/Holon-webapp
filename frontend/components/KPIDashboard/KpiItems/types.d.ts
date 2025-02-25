import {KpiView} from "@/components/KPIDashboard/KpiItems/KpiDisplay"

export interface KpiDisplayProps {
    previousValue?: number | null,
    currentValue?: number | null,
    view?: KpiView,
}
