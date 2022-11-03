import { useState, useEffect } from "react";
import Card from "./Card";

type Props = {
  data: {
    type: string;
    value: {
      cards: Array<CardItem>;
    };
    id: string;
  };
};

type CardItem = {
  title: string;
  image_selector: {
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
  card_background: string;
};

export default function CardBlock({ data }: Props) {
  const [cardItems, setCardItems] = useState<Array<CardItem>>([]);

  useEffect(() => {
    const cardArray: Array<CardItem> = [];
    if (data.value.cards.length) {
      {
        data.value?.cards.map((cardItem: CardItem) => {
          cardArray.push(cardItem);
        });
      }
    }
    setCardItems(cardArray);
  }, [data]);

  return (
    <div className={`flex flex-row w-full justify-center h-fit py-12 px-10 lg:px-16 lg:pt-16`}>
      <div className={`flex flex-row  flex-wrap`}>
        {cardItems.map((cardItem, _index) => {
          return <Card cardItem={cardItem} key={_index}></Card>;
        })}
      </div>
    </div>
  );
}
