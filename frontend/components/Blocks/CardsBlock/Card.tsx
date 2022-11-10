import RawHtml from "../../RawHtml/RawHtml";
import Image from "next/future/image";

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
    <div className={` min-h-[400px] ${colorStyle} border-solid border-2 rounded-lg flex flex-col`}>
      <div className="overflow-hidden relative m-4 mb-0 flex-1 border">
        <Image
          src={cardItem.imageSelector.img.src}
          alt={cardItem.imageSelector.img.alt}
          width="725"
          height="380"
          className={"object-fill min-h-full"}
          key={"image_" + key}
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
