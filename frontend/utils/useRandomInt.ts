import {useMemo, useRef} from "react"

function generateRandomInt(): number {
    const randomFloat = Math.random() * Number.MAX_SAFE_INTEGER
    return Math.round(randomFloat)
}

export const useRandomInt = () => useMemo(generateRandomInt, [])
