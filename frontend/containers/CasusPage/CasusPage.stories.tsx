/* global module */

import React from "react"
import CasusPage from "./CasusPage"
import data from "./CasusPage.data"

export default {
    title: "Components/CasusPage",
    component: CasusPage,
}

export const CasusPageWithoutData = () => <CasusPage />
export const CasusPageWithData = () => <CasusPage {...data} />
