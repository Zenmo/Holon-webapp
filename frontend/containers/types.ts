import CardBlock from "@/components/Blocks/CardsBlock"
import HeroBlock from "@/components/Blocks/HeroBlock"
import TitleBlock from "@/components/Blocks/TitleBlock"
import TextAndMedia from "@/components/Blocks/TextAndMediaBlock"
import { Background, GridLayout } from "@/components/Blocks/types"
import {Content, RichTextBlock} from "@/components/Blocks/SectionBlock/types"
import HeaderFullImageBlock from "@/components/Blocks/HeaderFullImageBlock/HeaderFullImageBlock"

export type CardBlockVariant = {
    type: "card_block"
} & React.ComponentProps<typeof CardBlock>["data"]

export type HeroBlockVariant = {
    type: "hero_block"
} & React.ComponentProps<typeof HeroBlock>["data"]

export type SectionVariant = {
    type: "section"
    value: {
        background: Background
        content: Content[]
        textLabelNational: string
        textLabelIntermediate: string
        textLabelLocal: string
        gridLayout: GridLayout
        openingSection?: boolean
    }
    id: string
}

export type StepIndicatorVariant = {
    type: "step_indicator"
    value: (SectionVariant | StepAnchorVariant)[]
    id: string
}

export type StepAnchorVariant = {
    type: "step_anchor"
    value: string
    id: string
}

export type NextInletVariant = {
    id: string
    type: "next_inlet_block"
    inlet: string
}

export type RowBlockVariant = {
    id: string
    type: "row_block"
    value: {
        columns: ColumnBlockVariant[]
    }
}

export type ColumnBlockVariant = {
    id: string
    type: "column_block"
    value: {
        contentItems: Array<
            RichTextBlock
            | NextInletVariant
            | TitleBlockVariant
            // | React.ComponentProps<typeof HeaderFullImageBlock>["data"]
        >
    }
}

export type TextAndMediaVariant = {
    type: "text_image_block"
} & React.ComponentProps<typeof TextAndMedia>["data"]

export type TitleBlockVariant = {
    type: "title_block"
} & React.ComponentProps<typeof TitleBlock>["data"]

export type PageProps<Types> = {
    id: string
} & Types

export type StorylineScenario = {
    id: number
    name: string
    description?: string
    tag: string
    sliderValueDefault: number
    sliderValueMin: number
    sliderValueMax: number
    sliderLocked: boolean
}
export type StorylineSlider = {
    id: string
    type: string
    value: StorylineScenario
}

export type Scenario = {
    id: string
    type: string
    value: { content: StorylineSlider[] }
}

export type Graphcolor = {
    name: string
    color: string
}
export type WikiLink = {
    id: string
    value: string
    type: string
}
