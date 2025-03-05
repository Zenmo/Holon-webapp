import { css } from "@emotion/react"
import {lg} from "@/styles/breakpoints"
import {assertDefined} from "@/utils/assertDefined"

/**
 * Parse a string which specifies column widths like "30_70"
 */
export function parseTwoColumnSpec(columnSpec: string) {
    const [_, left, right] = assertDefined(/(\d+)_(\d+)/.exec(columnSpec))

    return {
        left: parseInt(left),
        right: parseInt(right),
    }
}

/**
 * Parse a string which specifies column widths like "30_70" and convert it to CSS specifications for both columns.
 */
export function getGridCss(columnSpec: string) {
    const {left, right} = parseTwoColumnSpec(columnSpec)

    return {
        left: css({
            [lg]: {
                width: `calc(100% * ${left} / (${left} + ${right}))`,
            },
        }),
        right: css({
            [lg]: {
                width: `calc(100% * ${right} / (${left} + ${right}))`,
            },
        }),
    }
}
