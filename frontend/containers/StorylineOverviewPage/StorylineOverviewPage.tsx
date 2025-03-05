import React from "react"
import StorylineOverview from "@/components/Storyline/StorylineOverview/StorylineOverview"
import { basePageWrap } from "../BasePage"

import styles from "./StorylineOverviewPage.module.css"

import {
    PageProps,
    TextAndMediaVariant,
    HeroBlockVariant,
    TitleBlockVariant,
    CardBlockVariant,
} from "../types"
import ContentBlocks from "@/components/Blocks/ContentBlocks"

type Props = Pick<
    React.ComponentProps<typeof StorylineOverview>,
    "allInformationTypes" | "allRoles"
> & {
    allStorylines: React.ComponentProps<typeof StorylineOverview>["storylines"]
} & PageProps<TextAndMediaVariant | HeroBlockVariant | TitleBlockVariant | CardBlockVariant>

const StorylineOverviewPage = ({
    intro,
    footer,
    allInformationTypes,
    allRoles,
    allStorylines,
}: Props) => {
    return (
        <div>
            <div className="">
                <ContentBlocks content={intro} />
            </div>
            <div className={styles["StorylineOverviewPage"]}>
                <StorylineOverview
                    storylines={allStorylines}
                    allInformationTypes={allInformationTypes}
                    allRoles={allRoles}
                />
            </div>
            <div className="">
                <ContentBlocks content={footer} />
            </div>
        </div>
    )
}

export default basePageWrap(StorylineOverviewPage)
