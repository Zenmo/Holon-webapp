import { useState, useEffect } from "react";
import Image from "next/image";
import ReactPlayer from "react-player/lazy";

type MediaDetails = {
  media: [
    | {
        id: string;
        value: string;
        type: string;
        altText: string;
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
};

export default function MediaContent({ media }: MediaDetails) {
  const [imageSize, setImageSize] = useState({
    width: 1,
    height: 1,
  });
  const [hasWindow, setHasWindow] = useState(false);

  // TOOO: Is this UseEffect really needed / Do after merge
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  function showMedia(mediaDetail) {
    let returnValue = "";

    // TOOO: Replace the If ? by If && / Do after merge
    switch (mediaDetail.type) {
      case "video":
        returnValue =
          mediaDetail.value && hasWindow ? (
            <ReactPlayer
              width="100%"
              height="440px"
              key={`player ${mediaDetail.value.id}`}
              url={mediaDetail.value}
              controls={true}
            />
          ) : (
            ""
          );
        break;
      case "image":
        returnValue = mediaDetail.value ? (
          <Image
            src={process.env.NEXT_PUBLIC_BASE_URL + mediaDetail.value.img.src}
            alt={mediaDetail.value.img.alt}
            layout="responsive"
            objectFit="contain"
            priority={true}
            //this shows pictures with the relative size
            onLoadingComplete={target => {
              setImageSize({
                width: target.naturalWidth,
                height: target.naturalHeight,
              });
            }}
            width={imageSize.width}
            height={imageSize.height}
            className="image"
          />
        ) : (
          ""
        );
      default:
    }
    return returnValue;
  }

  // for now it is only possible to show one mediaitem (image or video). If more items can be added in wagtail then this should be altered to mapping and styling changed to render properly in the front-end.
  return <div>{showMedia(media[0])}</div>;
}
