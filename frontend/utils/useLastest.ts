import {cancellablePromise} from '@/utils/cancellablePromise'
import {useRef} from 'react'

export type Latest<T> = (promise: Promise<T>) => Promise<T>

// This hook returns a function to wrap a Promise.
// The function makes sure only a single Promise is in flight at a time for a React component.
// It can be used to keep inputs in sync with outputs.
export const useLastest = <T>(): Latest<T> => {
    const cancelRef = useRef(() => {})

    return (inputPromise: Promise<T>): Promise<T> => {
        cancelRef.current()
        const [cancel, outputPromise] = cancellablePromise(inputPromise)
        cancelRef.current = cancel
        return outputPromise
    }
}
