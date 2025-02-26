import React from "react"

import Card from "@/components/Card/Card"
import { basePageWrap } from "@/containers/BasePage"
import { PageProps, TextAndMediaVariant, TitleBlockVariant, CardBlockVariant } from "../types"
import ContentBlocks from "@/components/Blocks/ContentBlocks"

type Content = PageProps<TextAndMediaVariant | TitleBlockVariant | CardBlockVariant>

const BestPracticeOverviewPage = ({
    hero,
    content,
    childPractices,
}: {
    hero: any[]
    content: Content[]
    childPractices: any[]
}) => {
    return (
        <React.Fragment>
            <ContentBlocks content={hero} />

            <div className="holonContentContainer">
                <div className="defaultBlockPadding">
                    <div className="flex flex-row justify-center flex-wrap py-12 mx-[-1rem]">
                        {childPractices?.map((practice: any, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className="px-[1rem] flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
                                >
                                    <Card cardItem={practice} cardType="storylineCard" />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <ContentBlocks content={content} />
        </React.Fragment>
    )
}

export default basePageWrap(BestPracticeOverviewPage)
