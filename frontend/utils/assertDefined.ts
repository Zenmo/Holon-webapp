
export function assertDefined<T>(value: T | undefined | null): T {
    if (value === undefined || value === null) {
        throw new Error('value is undefined')
    }
    return value
}
