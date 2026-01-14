import React from "react"
import CardItem from "../../Card/Card"
import Card from "../../Card/Card"
import ButtonBlock from "@/components/Button/ButtonBlock"

type Props = {
    data: {
        type: string
        value: {
            cards: Array<typeof CardItem>
            buttonBlock: React.ComponentProps<(typeof ButtonBlock)["buttons"]>
        }
        id: string
    }
}

export default function CardBlock({
    data: {
        value: { cards, buttonBlock },
    },
}: Props) {
    return (
        <div className="holonContentContainer">
            <div
                className={`flex flex-row justify-center flex-wrap py-12 mx-[-1rem] defaultBlockPadding`}
                data-testid="cardblock"
            >
                {cards.map((cardItem, index) => {
                    return (
                        <Card
                            className="flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
                            key={index}
                            cardItem={cardItem}
                            cardType="cardBlockCard"
                            style={{margin: "1rem"}}
                        />
                    )
                })}
            </div>

            {buttonBlock.length > 0 && (
                <ButtonBlock
                    buttons={buttonBlock[0].value.buttons}
                    align={buttonBlock[0].value.buttonsAlign}
                />
            )}
        </div>
    )
}
