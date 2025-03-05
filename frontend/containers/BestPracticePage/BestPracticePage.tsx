import React from "react"
import Card from "@/components/Card/Card"
import styles from "./BestPracticePage.module.css"
import { basePageWrap } from "@/containers/BasePage"

import { PageProps, TextAndMediaVariant, TitleBlockVariant, CardBlockVariant } from "../types"
import ContentBlocks from "@/components/Blocks/ContentBlocks"

type Content = PageProps<TextAndMediaVariant | TitleBlockVariant | CardBlockVariant>

const BestPracticePage = ({ content, linkedCasus }: { content: Content[]; linkedCasus: any[] }) => {
    return (
        <div className={styles[""]}>
            <ContentBlocks content={content} />
            {linkedCasus && linkedCasus.length > 0 && (
                <div className="holonContentContainer">
                    <div className="defaultBlockPadding ">
                        <h2 className="mb-5">Bekijk de casus</h2>
                        <div className="flex flex-row gap-4">
                            {linkedCasus?.map((child, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="px-[1rem] flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
                                    >
                                        <Card cardItem={child} cardType="storylineCard" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default basePageWrap(BestPracticePage)
