import { basePageWrap } from "@/containers/BasePage"
import styles from "./ChallengeModePage.module.css"

import { FeedbackModal } from "@/components/Blocks/ChallengeFeedbackModal/types"
import ContentBlocks from "@/components/Blocks/ContentBlocks"
import { ScenarioContext } from "context/ScenarioContext"
import { Graphcolor, PageProps, SectionVariant, TextAndMediaVariant, WikiLink } from "../types"

type Storyline = PageProps<SectionVariant | TextAndMediaVariant>

export type Feedbackmodals = [FeedbackModal]

const ChallengeModePage = ({
    storyline,
    scenario,
    feedbackmodals,
    graphcolors,
    wikiLinks,
    title,
}: {
    storyline: Storyline[]
    scenario: number
    feedbackmodals: Feedbackmodals[]
    graphcolors: Graphcolor[]
    wikiLinks: WikiLink[]
    title: string
}) => {
    return (
        <div className={styles["ChallengeModePage"]}>
            <ScenarioContext.Provider value={scenario}>
                <ContentBlocks
                    content={storyline}
                    graphcolors={graphcolors ?? []}
                    feedbackmodals={feedbackmodals}
                    pagetitle={title}
                    wikilinks={wikiLinks}
                    pagetype="Challenge"
                />
            </ScenarioContext.Provider>
        </div>
    )
}

export default basePageWrap(ChallengeModePage)
