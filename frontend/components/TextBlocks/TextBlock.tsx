import React from "react";
import Image from "next/image";

import { contentTextBlocks } from "./contentTextBlocks";
import Paragraphs from "./Paragraphs";

type Props = React.PropsWithChildren<{
  borderColor?: string;
  right?: boolean;
  underlineTitleBlue?: boolean;
  value: keyof typeof contentTextBlocks;
}>;

export default function TextBlock(props: Props) {
  const stylingRight = props.right
    ? "items-end text-right lg:mr-24 border-r-8 pr-5"
    : "border-l-8 lg:ml-24 pl-5";
  const imageTextFlex = props.right ? "flex-row-reverse" : "flex-row";
  const flexValue = props.right ? "justify-end" : "";
  const value = props.value ? props.value : "default";
  const borderColor = props.borderColor ? props.borderColor : "border-white";
  const underlineTitleBlue = props.underlineTitleBlue ? "shadow-blue" : "";

  return (
    <div className={`mx-10 flex min-h-screen w-screen ${flexValue}`} data-testid="text-block">
      <div
        className={`flex w-full flex-col border-solid ${borderColor} ${stylingRight}`}
        data-testid="outlined-block"
      >
        <h2
          className={`mt-6 text-3xl font-semibold sm:text-4xl lg:mt-24 lg:text-5xl ${underlineTitleBlue}`}
        >
          {contentTextBlocks[value].title}
        </h2>
        <div className={`mt-4 lg:mt-10 lg:flex ${imageTextFlex} gap-20 align-middle`}>
          <div className="flex w-full flex-col lg:w-5/12">
            <div className="text-sm md:text-base lg:text-lg">
              <Paragraphs texts={contentTextBlocks[value].pText} />
            </div>
            <div className="my-4 flex flex-col items-center gap-4 sm:flex-row lg:mt-24">
              {props.children}
            </div>
          </div>
          <div className="w-full p-2 lg:w-7/12 lg:p-10">
            <Image src={contentTextBlocks[value].img} alt={contentTextBlocks[value].alt} />
          </div>
        </div>
      </div>
    </div>
  );
}
