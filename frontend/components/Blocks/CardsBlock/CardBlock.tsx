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

export default function CardBlock({
  data: {
    value: { cards },
  },
}: Props) {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 py-12 px-10 lg:px-16 lg:pt-16 gap-8`}>
      {cards.map((cardItem, index) => {
        return <Card cardItem={cardItem} key={index}></Card>;
      })}
    </div>
  );
}
