import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player/lazy";
import Image from "next/future/image";

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
  const [hasWindow, setHasWindow] = useState(false);

  // UseEffect used for Hydration Error fix. Keep it
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);
  if (!hasWindow) {
    // Returns null on first render, so the client and server match
    return null;
  }

  function showMedia(mediaDetail) {
    let returnValue = "";
    switch (mediaDetail.type) {
      case "video":
        returnValue = mediaDetail.value && hasWindow && (
          <ReactPlayer
            width="100%"
            height="440px"
            key={`player ${mediaDetail.value.id}`}
            url={mediaDetail.value}
            controls={true}
          />
        );
        break;
      case "image":
        returnValue = mediaDetail.value && (
          <Image
            src={mediaDetail.value.img.src}
            alt={mediaDetail.value.img.alt}
            className="image"
            width="1600"
            height="900"
          />
        );
      default:
    }
    return returnValue;
  }

  // for now it is only possible to show one mediaitem (image or video).
  // If more items can be added in wagtail then this should be altered to
  // mapping and styling changed to render properly in the front-end.
  return <React.Fragment>{showMedia(media[0])}</React.Fragment>;
}
