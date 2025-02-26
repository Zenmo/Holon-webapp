import {Dispatch, SetStateAction, useState} from "react"

/**
 * returns current value, previous value, and setter
 */
export function useStateWithHistory<S>(defaultValue: S): [S, S | null, Dispatch<SetStateAction<S>>] {
    const [currentValue, setCurrentValue] = useState(defaultValue)
    const [previousValue, setPreviousValue] = useState<S | null>(null)

    function setValue(newValue: SetStateAction<S>) {
        setPreviousValue(currentValue)
        setCurrentValue(newValue)
    }

    return [
        currentValue,
        previousValue,
        setValue,
    ]
}
