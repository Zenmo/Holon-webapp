
export function findSingle<T>(array: Array<T>, predicate: (item: T) => boolean): T {
    const matches = array.filter(predicate)
    if (matches.length > 1) {
        throw Error("findSingle result not unique: " + matches)
    }

    if (matches.length === 0) {
        throw Error("findSingle result not found")
    }

    return matches[0]
}
