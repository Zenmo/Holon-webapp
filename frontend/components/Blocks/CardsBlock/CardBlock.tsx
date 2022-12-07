import React from "react";
import CardItem from "../../Card/Card";
import Card from "../../Card/Card";
import ButtonBlock from "@/components/Button/ButtonBlock";

type Props = {
  data: {
    type: string;
    value: {
      cards: Array<typeof CardItem>;
      buttonBlock: React.ComponentProps<typeof ButtonBlock["buttons"]>;
    };
    id: string;
  };
};

export default function CardBlock({
  data: {
    value: { cards, buttonBlock },
  },
}: Props) {
  return (
    <div>
      <div
        className={`flex flex-row justify-center flex-wrap py-12 px-10 lg:px-16 lg:pt-16 gap-[2%]`}
        data-testid="cardblock">
        {cards.map((cardItem, index) => {
          return (
            <React.Fragment key={index}>
              <Card cardItem={cardItem} cardType="cardBlockCard"></Card>
            </React.Fragment>
          );
        })}
      </div>
      {buttonBlock.length > 0 && (
        <ButtonBlock
          buttons={buttonBlock[0].value.buttons}
          align={buttonBlock[0].value.buttonsAlign}></ButtonBlock>
      )}
    </div>
  );
}
