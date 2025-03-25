export function formatPreviousKpiNumber(value: number | null | undefined, fractionDigits: number = 1) {
    return formatKpiNumber(value, "", fractionDigits)
}

export function formatCurrentKpiNumber(value: number | null | undefined, fractionDigits: number = 1) {
    return formatKpiNumber(value, "-", fractionDigits)
}

export function formatKpiNumber(value: number | null | undefined, empty = "-", fractionDigits: number = 1): string {
    if (value == undefined) {
        return empty
    } else if (typeof value == "number") {
        return value.toFixed(fractionDigits)
    } else {
        return value
    }
}
