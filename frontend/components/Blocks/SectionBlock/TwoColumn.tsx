import {lg} from "@/styles/breakpoints"
import {parseTwoColumnSpec} from "@/services/grid"
import React, {FunctionComponent, HTMLAttributes, ReactNode} from "react"
import tailwind from "@/tailwind.config"

interface TwoColumnSimulationLayoutProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    /**
     * A string which specifies column widths like "30_70".
     * Overrides left and right if present
     */
    columnSpec?: string
    left?: number
    right?: number
}

/**
 * Responsive two-column-layout where the left column is usually thinner and has a grey-blue background
 */
export const TwoColumnSimulationLayout: FunctionComponent<TwoColumnSimulationLayoutProps> = ({
    children,
    columnSpec,
    left = 5,
    right = 7,
    ...rest
}) => {
    if (columnSpec) {
        ({left, right} = parseTwoColumnSpec(columnSpec))
    }

    return <div css={{
        display: "flex",
        flexDirection: "column",
        [lg]: {
            flexDirection: "row",
            "& > :nth-child(1)": {
                width: `calc(100% * ${left} / (${left} + ${right}))`,
            },
            "& > :nth-child(2)": {
                width: `calc(100% * ${right} / (${left} + ${right}))`,
            },
        },
        position: "relative",
        "& > :nth-child(1)": {
            display: "flex",
            flexDirection: "column",
            paddingTop: "3rem",
            paddingBottom: "3rem",
            paddingRight: "2.5rem",
            paddingLeft: "2.5rem",
            [lg]: {
                paddingTop: "4rem",
            },
            position: "relative",
            backgroundColor: tailwind.theme.extend.colors["holon-gray-100"],
        },
        "& > :nth-child(2)": {
            display: "flex",
            flexDirection: "column",
            position: "relative",
        }
    }} {...rest}>
        {children}
        <hr
            className="border-holon-blue-900 absolute bottom-0 right-0"
            style={{ width: "calc(100% - 2rem)" }}
        />
    </div>
}
