/* global module */

import React from "react"
import StorylineOverviewPage from "./StorylineOverviewPage"
import data from "./StorylineOverviewPage.data"

export default {
    title: "Components/StorylineOverviewPage",
    component: StorylineOverviewPage,
}

export const StorylineOverviewPageWithoutData = () => <StorylineOverviewPage />
export const StorylineOverviewPageWithData = () => <StorylineOverviewPage {...data} />
