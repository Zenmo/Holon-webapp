import {mapValues} from "lodash"

// copied from https://tailwindcss.com/docs/responsive-design#overview
const tailwindBreakPointsRem = {
    sm: 40,
    md: 48,
    lg: 64,
    xl: 80,
    xxl: 96, // 2xl
}

const mediaQueries = mapValues(tailwindBreakPointsRem, (bp => `@media (min-width: ${bp}rem)`))

export const { sm, md, lg, xl, xxl } = mediaQueries

