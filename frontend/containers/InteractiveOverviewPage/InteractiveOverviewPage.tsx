import React from "react"

import Card from "@/components/Card/Card"
import { basePageWrap } from "@/containers/BasePage"
import ContentBlocks from "@/components/Blocks/ContentBlocks"

const InteractiveOverviewPage = ({
    hero,
    overviewPages,
}: {
    hero: any[]
    overviewPages: any[]
}) => {
    return (
        <React.Fragment>
            <ContentBlocks content={hero} />
            <div className="holonContentContainer">
                <div className="defaultBlockPadding">
                    <div className="flex flex-row gap-4">
                        {overviewPages?.map((page: any, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className="px-[1rem] flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
                                >
                                    <Card cardItem={page} cardType="storylineCard" />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default basePageWrap(InteractiveOverviewPage)
