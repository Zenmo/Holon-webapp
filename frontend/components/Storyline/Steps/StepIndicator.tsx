import { FunctionComponent, useEffect, useState } from "react"
import { Step, StepData } from "@/components/Storyline/Steps/Step"

import { StepAnchorVariant, StepIndicatorVariant } from "@/containers/types"

export const StepIndicator: FunctionComponent<{
    stepIndicatorBlock: StepIndicatorVariant
    className?: string
}> = ({ stepIndicatorBlock, className = "" }) => {
    const [steps, setSteps] = useState<StepData[]>(anchorsToStepData(stepIndicatorBlock))

    useEffect(() => {
        const handleScroll = () => {
            const activeStepId = findVisibleStepId(steps)

            setSteps(steps =>
                steps.map(step => ({
                    ...step,
                    active: step.id === activeStepId,
                })),
            )
        }
        // execute once on component load
        handleScroll()
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <div className={className} css={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            gap: "1.6rem",

            minWidth: "4rem",
            position: "sticky",

            top: "5rem",

            padding: "1rem",
            paddingTop: "2rem",
            zIndex: 20,
        }}>
            {steps.map(step => {
                return <Step key={step.id} {...step} />
            })}
        </div>
    )
}

const anchorsToStepData = (stepIndicatorBlock: StepIndicatorVariant): StepData[] => {
    return stepIndicatorBlock.value
        .filter((section): section is StepAnchorVariant => section.type === "step_anchor")
        .map((section: StepAnchorVariant, index): StepData => {
            return {
                id: section.id,
                title: section.value || `Stap ${index + 1}`,
                index: index,
                active: false,
            }
        })
}

/**
 * This looks for the last step anchor that is above the middle of the screen.
 */
const findVisibleStepId = (steps: StepData[]): string | null => {
    let activeStepId = null
    for (const step of steps) {
        const anchorElement = document.getElementById(step.id)
        if (!anchorElement) {
            console.error(`Anchor element with id ${step.id} not in DOM`)
            continue
        }

        const rect = anchorElement.getBoundingClientRect()
        if (rect.top < window.visualViewport.height / 2) {
            activeStepId = step.id
        } else {
            // done finding the element in screen
            break
        }
    }
    return activeStepId
}
