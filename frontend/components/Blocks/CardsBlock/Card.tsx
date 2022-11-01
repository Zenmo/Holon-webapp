import RawHtml from "../../RawHtml/RawHtml";
import Image from "next/image";

export default function Card({ data }) {
  const backgroundcolor = data.value.background;

  return (
    <div className={`flex flex-row`}>
      <div className={`flex flex-col`}>
        <Image
          src={process.env.NEXT_PUBLIC_BASE_URL + medi.value}
          alt={mediaItem.alt_text}
          layout="responsive"
          objectFit="contain"
          priority={true}
          onLoadingComplete={target => {
            setImageSize({
              width: target.naturalWidth,
              height: target.naturalHeight,
            });
          }}
          width={imageSize.width}
          height={imageSize.height}
          key={"image_" + _index}
          className="image"></Image>
        <RawHtml html={data.value?.title} />
        <div className="mt-6">
          <RawHtml html={data.value?.text} />
        </div>
      </div>
    </div>
  );
}
