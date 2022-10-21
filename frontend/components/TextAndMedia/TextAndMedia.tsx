import { useState, useEffect } from "react";
import Image from "next/image";
import RawHtml from "../RawHtml";
import ReactPlayer from "react-player/lazy";

export default function TextAndMedia({ data }) {
  type MediaItem = {
    id: string;
    value: string;
    type: string;
  };

  const [mediaItems, setMediaItems] = useState<Array<MediaItem>>([]);

  useEffect(() => {
    let mediaArray: Array<MediaItem> = [];
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
    <div className="storyline__row flex flex-col lg:flex-row">
      <div className="flex flex-col p-8 lg:w-1/3 bg-slate-200">
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
                    alt="Alt texts todo"
                    layout="responsive"
                    width="768px"
                    height="500px"
                    key={"image_" + _index}
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
  );
}
