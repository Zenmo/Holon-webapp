import { useState, useEffect } from "react";
import Image from "next/image";
import RawHtml from "../RawHtml";
import ReactPlayer from "react-player/lazy";
import HolonButton from "../VersionOne/Buttons/HolonButton";

type Props = {
  data: {
    type: string;
    value: {
      backgroundColor: string;
      title: string;
      size: string;
      text: string;
      media: [
        | {
            id: string;
            value: string;
            type: string;
            alt_text: string;
          }
        | {
            type: string;
            value: {
              id: number;
              title: string;
              img: {
                src: string;
                width: number;
                height: number;
                alt: string;
              };
            };
          }
      ];
      altText: string;
      gridLayout: string;
      button?: {
        button_style: string;
        button_text: string;
        button_hyperlink: string;
      };
    };
    id: string;
  };
};

export default function TextAndMedia({ data }: Props) {
  type MediaItem = {
    id: string;
    value: {
      id: number;
      title: string;
      img: {
        src: string;
        width: number;
        height: number;
        alt: string;
      };
    };
    type: string;
    alt_text: string;
  };

  const [mediaItems, setMediaItems] = useState<Array<MediaItem>>([]);
  const [imageSize, setImageSize] = useState({
    width: 1,
    height: 1,
  });
  const [gridDivision, setGridDivision] = useState({
    left: "w-1/2",
    right: "w-1/2",
  });

  const backgroundcolor = data.value.backgroundColor;
  const Tag = data.value.size;

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

  useEffect(() => {
    if (data.value.gridLayout === "33_66") {
      setGridDivision({
        left: "lg:w-1/3",
        right: "lg:w-2/3",
      });
    } else if (data.value.gridLayout == "50_50") {
      setGridDivision({
        left: "lg:w-1/2",
        right: "lg:w-1/2",
      });
    } else if (data.value.gridLayout == "66_33") {
      setGridDivision({
        left: "lg:w-2/3",
        right: "lg:w-1/3",
      });
    }
  }, [data]);

  return (
    <div>
      <div className={`${backgroundcolor} storyline__row flex flex-col lg:flex-row`}>
        <div
          className={`flex flex-col py-12 px-10 lg:px-16 lg:pt-16 ${gridDivision.left} bg-holon-pale-gray`}>
          <Tag className={`mb-6`}>{data.value.title}</Tag>
          <RawHtml html={data.value?.text} />
        </div>

        <div className={`flex flex-col ${gridDivision.right}`}>
          <div className="lg:sticky py-12 px-10 lg:px-16 lg:pt-24 top:0">
            {mediaItems.map((mediaItem, _index) => {
              switch (mediaItem.type) {
                case "video":
                  return <ReactPlayer key={"player" + _index} url={mediaItem.value} />;
                  break;
                case "image":
                  return (
                    <Image
                      src={process.env.NEXT_PUBLIC_BASE_URL + mediaItem.value.img.src}
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
    </div>
  );
}

{
  /*{data.value.button ? (
  <div className="flex flex-row justify-center relative">
    <HolonButton
      variant={data.value.button.button_style}
      href={data.value.button.button_hyperlink}>
      {data.value.button.button_text}
    </HolonButton>
  </div>
) : (
  ""
)} */
}
