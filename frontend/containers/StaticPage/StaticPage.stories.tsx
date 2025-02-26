/* global module */

import React from "react"
import StaticPage from "./StaticPage"
import data from "./StaticPage.data"

export default {
    title: "Components/StaticPage",
    component: StaticPage,
}

export const StaticPageWithoutData = () => <StaticPage />
export const StaticPageWithData = () => <StaticPage {...data} />
