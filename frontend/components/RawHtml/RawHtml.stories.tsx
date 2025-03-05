import React from "react"
import RawHtml from "./RawHtml"

import data from "./RawHtml.data"

function stories() {
    return {
        title: "Components/RawHtml",
        component: RawHtml,
    }
}

export default stories

export const RawHtmlWithoutData = () => <RawHtml />
export const RawHtmlWithData = () => <RawHtml {...data} />
