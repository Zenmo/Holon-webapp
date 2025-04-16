import {FunctionComponent} from "react"
import {RowBlockVariant} from "@/containers/types"
import {ColumnBlock} from "@/components/Blocks/ColumnBlock"
import {md} from "@/styles/breakpoints"

export const RowBlock: FunctionComponent<RowBlockVariant> = (rowBlockProps) => (
    <div css={{
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        [md]: {
            flexDirection: "row",
            justifyContent: "center",
        },
    }} className="defaultBlockPadding holonContentContainer" >
        {rowBlockProps.value.columns.map(
            columnProps => <ColumnBlock key={columnProps.id} {...columnProps} />
        )}
    </div>
)
