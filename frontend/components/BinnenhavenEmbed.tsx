import {FunctionComponent} from "react"

export const BinnenhavenEmbed: FunctionComponent = () => (
    <iframe src="https://binnenhaven.resourcefully.nl/?origin=holon" style={{
        height: "calc(100vh - var(--header-height))",
        width: "100%",
    }}></iframe>
)
