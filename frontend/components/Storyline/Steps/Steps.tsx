import {FunctionComponent, useEffect, useState} from "react";
import {Storyline} from "@/containers/StorylinePage/StorylinePage";
import {Step} from "@/components/Storyline/Steps/Step";
import styles from "./Steps.module.css";
import {SectionVariant} from "@/containers/types";

type StepData = {
    id: string,
    title: string,
    index: number,
}

export const Steps: FunctionComponent<{storyline: Storyline[], className?: string}> = ({storyline, className = ""}) => {
    // useState + useEffect is to force client side rendering
    // because it uses DOMParser to grep for a title
    // which is not available in Node.js.
    const [steps, setSteps] = useState<StepData[]>([])
    useEffect(() => {
        setSteps(stepsFromStoryLine(storyline))
    }, [storyline])

    return (
        <div className={`${styles.Steps} ${className}`}>
            {steps.map((step) => {
                return (
                    <Step
                        key={step.id}
                        id={step.id}
                        num={step.index + 1}
                        title={step.title}
                    />
                );
            })}
        </div>
    );
}

const stepsFromStoryLine = (storyline: Storyline[]) => {
    return storyline
        .filter((section) => section.type === "section")
        .map((section, index) => {
            const title = searchTitle(section) || `Stap ${index + 1}`

            return {
                id: section.id,
                title: title,
                index: index,
            }
        })
}

const searchTitle = (section: SectionVariant): string|null|undefined => {
    const contentItems = section.value.content
    const textItem = contentItems.find((contentItem) => contentItem.type === "text")

    if (!textItem) {
        return null
    }

    if (typeof DOMParser === "undefined") {
        return null
    }
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(textItem.value, "text/html");

    return htmlDoc.querySelector("h1, h2, h3, h4, h5, h6")?.textContent
}
