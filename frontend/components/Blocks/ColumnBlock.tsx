import {FunctionComponent} from "react"
import {ColumnBlockVariant} from "@/containers/types"
import ContentBlocks from "@/components/Blocks/ContentBlocks"

export const ColumnBlock: FunctionComponent<ColumnBlockVariant> = (columnBlockProps) => (
    <div style={{
        // divide horizontal space between all columns equally
        flexBasis: "5rem",
        flexGrow: 1,
    }}>
        <ContentBlocks content={columnBlockProps.value.contentItems} />
    </div>
)
