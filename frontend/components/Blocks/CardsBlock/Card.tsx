import RawHtml from "../../RawHtml/RawHtml";
import Image from "next/image";

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

export default function Card({ cardItem, key }) {
  const colorStyle: string = cardItem.cardBackground;

  return (
    <div
      className={`w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 min-h-[400px] m-8 ${colorStyle} border-solid border-2 rounded-lg`}>
      <div className="h-1/2 overflow-hidden relative m-4">
        <Image
          src={process.env.NEXT_PUBLIC_BASE_URL + cardItem.imageSelector.img.src}
          alt={cardItem.imageSelector.img.alt}
          layout="fill"
          objectFit="cover"
          key={"image_" + key}
          className="image"></Image>
      </div>

      <span className="flex-col flex h-1/2 m-4">
        <strong className="mb-3 block">{cardItem.title}</strong>
        <span className="">
          <RawHtml html={cardItem.text} />
        </span>
      </span>
    </div>
  );
}
