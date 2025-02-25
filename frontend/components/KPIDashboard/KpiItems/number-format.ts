export function formatPreviousKpiNumber(value: number | null | undefined) {
    return formatKpiNumber(value, "")
}

export function formatCurrentKpiNumber(value: number | null | undefined) {
    return formatKpiNumber(value, "-")
}

export function formatKpiNumber(value: number | null | undefined, empty: string = "-"): string {
    if (value == undefined) {
        return empty
    } else if (typeof value == "number") {
        return value.toFixed(1)
    } else {
        return value
    }
}
