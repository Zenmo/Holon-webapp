import {DataType} from "csstype"

export type SankeyNode = {
    name: string
    color?: DataType.Color
} & (
    {
        // I would like to specify just y.
        // Unfortunately both must be specified for plotly to work.
        x: number
        y: number
    } | {
        x?: undefined
        y?: undefined
    }
)
