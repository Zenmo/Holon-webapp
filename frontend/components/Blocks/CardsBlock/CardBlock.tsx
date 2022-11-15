import Card from "./Card";
import ButtonBlock from "@/components/Button/ButtonBlock";

type Props = {
  data: {
    type: string;
    value: {
      cards: Array<CardItem>;
      buttonBlock: [] | Array<Buttons>;
    };
    id: string;
  };
};

type CardItem = {
  title: string;
  imageSelector: {
    id: number;
    title: string;
    img: {
      src: string;
      width: number;
      height: number;
      alt: string;
    };
  };
  text: string;
  cardBackground: string;
};

type Buttons = {
  type: string;
  value: {
    buttonsAlign: string;
    buttons: Array<Button>;
  };
  id: string;
};

type Button = {
  type: string;
  value: {
    buttonStyle: "dark" | "light" | undefined;
    buttonText: string;
    buttonLink: [
      {
        type: "intern" | "extern";
        value: number | string;
        id: string;
      }
    ];
    buttonAlign: string;
  };
  id: string;
};

export default function CardBlock({
  data: {
    value: { cards, buttonBlock },
  },
}: Props) {
  return (
    <div
      className={`flex flex-row w-full justify-center h-fit py-12 px-10 lg:px-16 lg:pt-16 flex-wrap`}>
      {cards.map((cardItem, index) => {
        return <Card cardItem={cardItem} key={index}></Card>;
      })}

      {buttonBlock.length > 0 && (
        <ButtonBlock
          buttons={buttonBlock[0].value.buttons}
          align={buttonBlock[0].value.buttonsAlign}></ButtonBlock>
      )}
    </div>
  );
}
