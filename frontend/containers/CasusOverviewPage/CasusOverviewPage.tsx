import React from "react"

import ContentBlocks from "@/components/Blocks/ContentBlocks"
import Card from "@/components/Card/Card"
import { basePageWrap } from "@/containers/BasePage"
import { CardBlockVariant, PageProps, TextAndMediaVariant, TitleBlockVariant } from "../types"

type Content = PageProps<TextAndMediaVariant | TitleBlockVariant | CardBlockVariant>

const CasusOverviewPage = ({
    hero,
    content,
    childCasusses,
}: {
    hero: any[]
    content: Content[]
    childCasusses: any[]
}) => {
    return (
        <React.Fragment>
            <ContentBlocks content={hero} />

            <div className="holonContentContainer">
                <div className="defaultBlockPadding">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-4">
                            <div className="flex flex-row flex-wrap justify-center md:justify-start mx-[-1rem]">
                                {childCasusses?.map((casus: any, index: number) => {
                                    return (
                                        <div
                                            key={index}
                                            className="px-[1rem] flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
                                        >
                                            <Card cardItem={casus} cardType="storylineCard" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ContentBlocks content={content} />
        </React.Fragment>
    )
}

export default basePageWrap(CasusOverviewPage)
