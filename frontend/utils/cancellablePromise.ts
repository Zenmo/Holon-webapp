export const cancellablePromise = <T>(
    promise: Promise<T>,
): [cancel: () => void, promise: Promise<T>] => {
    let cancelled = false
    const cancel = () => {
        cancelled = true
    }

    return [
        cancel,
        new Promise((resolve, reject) => {
            promise.then(result => {
                if (!cancelled) {
                    resolve(result)
                }
            })
            promise.catch(error => {
                if (!cancelled) {
                    reject(error)
                }
            })
        }),
    ]
}
