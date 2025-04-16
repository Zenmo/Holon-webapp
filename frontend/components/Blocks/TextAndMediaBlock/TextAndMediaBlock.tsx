import RawHtml from "@/components/RawHtml"
import MediaContent from "@/components/MediaContent/MediaContent"
import ButtonBlock from "@/components/Button/ButtonBlock"
import { getGridCss } from "services/grid"
import { GridLayout, Background } from "../types"

type Props = {
    data: {
        type: string
        value: {
            gridLayout: GridLayout
            columnOrder: string
            background: Background
            text: string
            media: React.ComponentProps<typeof MediaContent>["media"]
            altText: string
            caption?: string
            buttonBlock: React.ComponentProps<(typeof ButtonBlock)["buttons"]>
        }
        id: string
    }
}

export default function TextAndMedia({ data }: Props) {
    const backgroundFullcolor =
        data.value.background.size == "bg__full" ? data.value.background.color : ""

    // Have to create a seperate variable for this since the bg-color is semi-transparent
    // Otherwise they will overlap and will the left be darker since 2 layers
    const backgroundLeftColor =
        data.value.background.size == "bg__full" ? "" : data.value.background.color

    const gridValue = getGridCss(data.value.gridLayout.grid)
    const direction =
        data.value.columnOrder === "invert" ? "lg:flex-row-reverse inverseColumns" : "lg:flex-row"

    return (
        <div className={`overflow-hidden ${backgroundFullcolor}`}>
            <div className="holonContentContainer">
                <div className={`flex flex-col ${direction}`}>
                    <div
                        css={gridValue.left}
                        className={`flex flex-col relative defaultBlockPadding ${backgroundLeftColor}`}
                        data-testid="textMedia"
                    >
                        {data.value.background.size !== "bg_full" && (
                            <span className={`extra_bg ${backgroundLeftColor}`}></span>
                        )}
                        <RawHtml html={data.value?.text} />
                    </div>

                    <div className="flex flex-col" css={gridValue.right}>
                        <div className="lg:sticky defaultBlockPadding top-0">
                            <MediaContent media={data.value.media} alt={data.value.altText} caption={data.value.caption}/>
                        </div>
                    </div>
                </div>

                {data.value.buttonBlock.length > 0 && (
                    <ButtonBlock
                        buttons={data.value.buttonBlock[0].value.buttons}
                        align={data.value.buttonBlock[0].value.buttonsAlign}
                    ></ButtonBlock>
                )}
            </div>
        </div>
    )
}
