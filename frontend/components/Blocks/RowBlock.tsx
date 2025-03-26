import {FunctionComponent} from "react"
import {RowBlockVariant} from "@/containers/types"
import {ColumnBlock} from "@/components/Blocks/ColumnBlock"

export const RowBlock: FunctionComponent<RowBlockVariant> = (rowBlockProps) => (
    <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "2.5rem",
    }} className="defaultBlockPadding holonContentContainer" >
        {rowBlockProps.value.columns.map(
            columnProps => <ColumnBlock key={columnProps.id} {...columnProps} />
        )}
    </div>
)
