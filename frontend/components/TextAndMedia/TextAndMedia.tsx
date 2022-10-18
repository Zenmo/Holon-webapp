import { useState, useEffect } from "react";
import RawHtml from "../RawHtml";
import ReactPlayer from "react-player/lazy";

export default function TextAndMedia({ data }) {
  const [mediaItems, setMediaItems] = useState<Array<string>>([]);

  useEffect(() => {
    let mediaArray: Array<string> = [];
    if (data.value.media.length) {
      {
        data.value?.media.map((mediaItem: { value: string }) => {
          mediaArray.push(mediaItem.value);
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
            return <ReactPlayer url={mediaItem} />;
          })}
        </div>
      </div>
    </div>
  );
}
