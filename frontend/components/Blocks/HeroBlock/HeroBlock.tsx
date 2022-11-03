import { useState, useEffect } from "react";
import Image from "next/image";
import ReactPlayer from "react-player/lazy";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

import RawHtml from "../../RawHtml";

type Props = {
  data: {
    type: string;
    value: {
      backgroundColor: string;
      title: string;
      text: string;
      media: [];
      alt_text: string;
      button?: {
        button_style: string;
        button_text: string;
        button_hyperlink: string;
      };
    };
    id: string;
  };
};

export default function HeroBlock({ data }: Props) {
  const [imageSize, setImageSize] = useState({
    width: 1,
    height: 1,
  });
  const [hasWindow, setHasWindow] = useState(false);

  const backgroundcolor = data.value.backgroundColor;
  const mediaDetails = data.value.media[0];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  const scrollDown = () => {
    const viewportHeight = window.innerHeight;
    window.scrollTo({
      top: viewportHeight,
    });
  };

  return (
    <div className={``}>
      <div className={`flex flex-col justify-center w-full ${backgroundcolor}`}>
        <div className={`flex flex-col  lg:flex-row `}>
          <div className="flex flex-col lg:w-1/2 py-12 px-10 lg:px-16">
            <h1>
              <RawHtml html={data.value.title}></RawHtml>
            </h1>
            <div className={`text-3xl font-normal mt-8 mr-8`}>
              <RawHtml html={data.value.text}></RawHtml>
            </div>
          </div>

          <div className="flex flex-col py-12 px-10 lg:px-16 lg:pt-24 lg:w-1/2">
            {(() => {
              let returnValue = "";
              switch (mediaDetails.type) {
                case "video":
                  returnValue =
                    mediaDetails.value && hasWindow ? (
                      <ReactPlayer
                        key={`player ${mediaDetails.value.id}`}
                        url={mediaDetails.value}
                      />
                    ) : (
                      ""
                    );
                  break;
                case "image":
                  returnValue = mediaDetails.value ? (
                    <Image
                      src={process.env.NEXT_PUBLIC_BASE_URL + "/" + mediaDetails.value.img.src}
                      alt={mediaDetails.value.img.alt}
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
                      className="image"
                    />
                  ) : (
                    ""
                  );
                default:
              }

              return <div>{returnValue}</div>;
            })()}
          </div>
        </div>

        <div className="flex flex-row h-16 justify-center">
          <button
            onClick={scrollDown}
            className="bg-holon-purple-100 w-12 h-12 mb-4 absolute rounded-full p-2 hover:bg-holon-purple-200">
            <ArrowDownIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
