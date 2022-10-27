import { useState, useEffect } from "react";
import Image from "next/image";
import RawHtml from "../RawHtml";
import ReactPlayer from "react-player/lazy";
import HolonButton from "../VersionOne/Buttons/HolonButton";
import Button from "../VersionOne/Buttons/HolonButton";
import { bodyStreamToNodeStream } from "next/dist/server/body-streams";

export default function TextAndMedia({ data }) {
  type MediaItem = {
    id: string;
    value: string;
    type: string;
    alt_text: string;
  };

  const [mediaItems, setMediaItems] = useState<Array<MediaItem>>([]);
  const [imageSize, setImageSize] = useState({
    width: 1,
    height: 1,
  });

  useEffect(() => {
    const mediaArray: Array<MediaItem> = [];
    if (data.value.media.length) {
      {
        data.value?.media.map((mediaItem: MediaItem) => {
          mediaArray.push(mediaItem);
        });
      }
    }
    setMediaItems(mediaArray);
  }, [data]);

  return (
    <div>
      <div className="storyline__row flex flex-col lg:flex-row">
        <div className="flex flex-col p-8 lg:w-1/3 bg-holon-pale-gray">
          <RawHtml html={data.value?.text} />
        </div>
        <div className="flex flex-col lg:w-2/3">
          <div className="lg:sticky top-0 p-8">
            {mediaItems.map((mediaItem, _index) => {
              switch (mediaItem.type) {
                case "video":
                  return <ReactPlayer key={"player" + _index} url={mediaItem.value} />;
                  break;
                case "image":
                  return (
                    <Image
                      src={process.env.NEXT_PUBLIC_BASE_URL + mediaItem.value}
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
                      className="image"
                    />
                  );
                  break;
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
      {data.value.button ? (
        <div className="flex flex-row justify-center relative">
          <HolonButton
            variant={data.value.button.button_style}
            href={data.value.button.button_hyperlink}
            size={data.value.button.button_size}>
            {data.value.button.button_text}
          </HolonButton>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
