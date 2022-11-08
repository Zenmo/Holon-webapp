import RawHtml from "../../RawHtml/RawHtml";

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

type Props = {
  cardItem: CardItem;
  key: number;
};

export default function Card({ cardItem, key }: Props) {
  const colorStyle: string = cardItem.cardBackground;

  return (
    <div
      className={`w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 min-h-[400px] mr-8 mb-8 ${colorStyle} border-solid border-2 rounded-lg flex flex-col`}>
      <div className="overflow-hidden relative m-4 mb-0 flex-1 border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={process.env.NEXT_PUBLIC_BASE_URL + cardItem.imageSelector.img.src}
          alt={cardItem.imageSelector.img.alt}
          key={"image_" + key}
          className="image"
        />
      </div>

      <span className="flex-col flex m-4 flex-1 max-h:1/2 overflow-hidden">
        <strong className="mb-3 block">{cardItem.title}</strong>
        <span className="">
          <RawHtml html={cardItem.text} />
        </span>
      </span>
    </div>
  );
}
