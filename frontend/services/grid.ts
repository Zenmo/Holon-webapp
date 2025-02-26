import { css } from "@emotion/react"

export function getGridCss(gridData: string) {
    const [_, left, right] = /(\d+)_(\d+)/.exec(gridData)

    return {
        left: css({
            "@media (min-width: 1024px)": {
                width: `calc(100% * ${left} / (${left} + ${right}))`,
            },
        }),
        right: css({
            "@media (min-width: 1024px)": {
                width: `calc(100% * ${right} / (${left} + ${right}))`,
            },
        }),
    }
}
