import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactPlayer from "react-player/lazy";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import HolonButton from "../../VersionOne/Buttons/HolonButton";

import RawHtml from "../../RawHtml";
import data from "@/components/VersionOne/Hero/Hero.data";

type Props = {
  data: {
    type: string;
    value: {
      block_background: {
        select_background: string;
      };
      title: string;
      text: string;
      media: [
        {
          id: string;
          value: string;
          type: string;
          alt_text: string;
        }
      ];
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

export default function HeroBlock(props: Props) {
  const [imageSize, setImageSize] = useState({
    width: 1,
    height: 1,
  });
  const backgroundcolor = props.data.value.block_background.select_background;
  const mediaDetails = props.data.value.media[0];

  //Link in button still needs href to next section
  const getMediaType = media => {
    let returnValue = "";
    switch (media.type) {
      case "video":
        returnValue = <ReactPlayer key={"player"} url={media.value} />;
        break;
      case "image":
        returnValue = (
          <Image
            src={process.env.NEXT_PUBLIC_BASE_URL + "/" + media.value}
            alt={media.alt_text}
            layout="responsive"
            objectFit="contain"
            priority={true}
            // onLoadingComplete={target => {
            //   setImageSize({
            //     width: target.naturalWidth,
            //     height: target.naturalHeight,
            //   });
            // }}
            width={"500"}
            height={"500"}
            key={"image_"}
            className="image"
          />
        );
      default:
    }

    return <div>{returnValue}</div>;
  };

  return (
    <div className="flex flex-row h-full">
      <div className="flex flex-col mx-8">
        <div className={`flex flex-col lg:flex-row ${backgroundcolor}`}>
          <div className="flex flex-col p-8 lg:w-1/2 lg:mt-16">
            <h1>
              <RawHtml html={props.data.value.title}></RawHtml>
            </h1>
            <div className={`text-3xl font-semibold mt-8 mr-8`}>
              <RawHtml html={props.data.value.text}></RawHtml>
            </div>
          </div>

          <div className="flex flex-col p-8 lg:w-1/2">{getMediaType(mediaDetails)}</div>
        </div>

        <div className="flex flex-row justify-center relative">
          <Link href="#start">
            <a className="bg-holon-purple-100 w-12 h-12 mb-4 absolute rounded-full p-2 hover:bg-holon-purple-200">
              <ArrowDownIcon />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
