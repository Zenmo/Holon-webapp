import { FunctionComponent, PropsWithChildren } from "react"
import { StepIndicator } from "@/components/Storyline/Steps/StepIndicator"
import { StepIndicatorVariant } from "@/containers/types"

export const StepIndicatorWrapper: FunctionComponent<
    PropsWithChildren<{ stepIndicatorBlock: StepIndicatorVariant }>
> = ({ stepIndicatorBlock, children }) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
            <StepIndicator stepIndicatorBlock={stepIndicatorBlock} />
        </div>
        <div>{children}</div>
    </div>
)
