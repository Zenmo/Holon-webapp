import {cancellablePromise} from '@/utils/cancellablePromise'

describe(cancellablePromise.name, () => {
    test('cancel resolve', async () => {
        let resolveFn;
        const promise1 = new Promise((resolve, reject) => {
            resolveFn = resolve
        })
        const [cancel, promise2] = cancellablePromise(promise1)
        cancel()
        resolveFn('success')

        const timePromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('timeout')
            }, 100)
        })

        const result = await Promise.race([promise2, timePromise])
        expect(result).toBe('timeout')
    })

    test('no cancel', async () => {
        let resolveFn;
        const promise1 = new Promise((resolve, reject) => {
            resolveFn = resolve
        })
        const [cancel, promise2] = cancellablePromise(promise1)
        resolveFn('success')

        const result = await promise2
        expect(result).toBe('success')
    })
})
