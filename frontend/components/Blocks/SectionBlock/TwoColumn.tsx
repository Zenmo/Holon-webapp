import styled from '@emotion/styled'
import {lg} from "@/styles/breakpoints"
import {parseTwoColumnSpec} from "@/services/grid"
import {FunctionComponent, ReactNode} from "react"
import tailwind from "@/tailwind.config"

/**
 * Responsive two-column-layout where the left column is thinner and has a grey-blue background
 */
export const TwoColumnSimulationLayout = styled.div<{
    left?: number,
    right?: number,
}>(({
    left = 5,
    right = 7,
}) => ({
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
}))

export const TwoColumnSimulationLayoutTwo: FunctionComponent<{className?: string, columnSpec: string, children: ReactNode[]}> = ({className, columnSpec = "5_7", children}) => {
    const {left, right} = parseTwoColumnSpec(columnSpec)

    return (
        <TwoColumnSimulationLayout left={left} right={right} className={className}>
            {children}
        </TwoColumnSimulationLayout>
    )
}
