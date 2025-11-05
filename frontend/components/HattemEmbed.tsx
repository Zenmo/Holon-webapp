import {FunctionComponent} from "react"

export const HattemEmbed: FunctionComponent = () => (
    <iframe src="https://hattem.resourcefully.nl/?origin=holon" style={{
        height: "calc(100vh - var(--header-height))",
        width: "100%",
    }}></iframe>
)
