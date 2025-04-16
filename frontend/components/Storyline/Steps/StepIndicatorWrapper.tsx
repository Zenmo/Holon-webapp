import { FunctionComponent, PropsWithChildren } from "react"
import { StepIndicator } from "@/components/Storyline/Steps/StepIndicator"
import { StepIndicatorVariant } from "@/containers/types"
import {md} from "@/styles/breakpoints"

export const StepIndicatorWrapper: FunctionComponent<
    PropsWithChildren<{ stepIndicatorBlock: StepIndicatorVariant }>
> = ({ stepIndicatorBlock, children }) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
        <div css={{
            display: "none",
            [md]: {
                display: "block",
            },
        }}>
            <StepIndicator stepIndicatorBlock={stepIndicatorBlock} />
        </div>
        <div>{children}</div>
    </div>
)
