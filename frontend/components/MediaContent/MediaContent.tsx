import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player/lazy";
import { StaticImage } from "../ImageSelector/types";

interface Props {
  media: MediaDetails;
  alt: string;
}

type MediaDetails = {
  media: [
    | {
        type: "video";
        id: string;
        value: string;
      }
    | {
        type: "image";
        value: StaticImage;
      }
  ];
};

export default function MediaContent({ media, alt }: Props) {
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

  function showMedia(mediaDetail: MediaDetails["media"][0]) {
    switch (mediaDetail.type) {
      case "video":
        return mediaDetail.value && hasWindow ? (
          <ReactPlayer
            width="100%"
            height="440px"
            key={mediaDetail.id}
            url={mediaDetail.value}
            controls={true}
            data-testid="video-player"
          />
        ) : null;
      case "image":
        return mediaDetail.value ? (
          /* eslint-disable @next/next/no-img-element */
          <img
            src={mediaDetail.value.img.src}
            alt={alt}
            className="image"
            width="1600"
            height="auto"
          />
        ) : (
          ""
        );
      default:
        return null;
    }
  }

  // for now it is only possible to show one mediaitem (image or video).
  // If more items can be added in wagtail then this should be altered to
  // mapping and styling changed to render properly in the front-end.
  return <React.Fragment>{showMedia(media[0])}</React.Fragment>;
}
