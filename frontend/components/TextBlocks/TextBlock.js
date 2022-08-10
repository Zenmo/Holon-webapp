import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";

import { contentTextBlocks } from "./contentTextBlocks.js";
import Paragraphs from "./Paragraphs";

export default function TextBlock(props) {
  const stylingRight = props.right
    ? "items-end text-right mr-24 border-r-8 pr-5"
    : "border-l-8 ml-24 pl-5";
  const imageTextFlex = props.right ? "flex-row-reverse" : "flex-row";
  const flexValue = props.right ? "justify-end" : "";
  const value = props.value ? props.value : "default";
  const borderColor = props.borderColor ? props.borderColor : "border-white";
  const extraContent = props.children ? props.children : "";
  const underlineTitleBlue = props.underlineTitleBlue ? "shadow-blue" : "";
  const underlineTitleGolden = props.underlineTitleGolden ? props.underlineTitleGolden : "";

  return (
    <div className={`mx-10 flex min-h-screen w-screen ${flexValue}`} data-testid="text-block">
      <div
        className={`flex w-full flex-col border-solid ${borderColor} ${stylingRight}`}
        data-testid="outlined-block"
      >
        <h2
          className={`mt-24 text-6xl font-semibold ${underlineTitleBlue} ${underlineTitleGolden}`}
        >
          {contentTextBlocks[value].title}
        </h2>
        <div className={`mt-10 flex ${imageTextFlex} gap-20 align-middle`}>
          <div className="flex w-5/12 flex-col">
            <div className="text-lg">
              <Paragraphs texts={contentTextBlocks[value].pText} />
            </div>
            <div className="mt-24 flex gap-4">{extraContent}</div>
          </div>
          <div className="w-7/12 p-10">
            <Image src={contentTextBlocks[value].img} alt={contentTextBlocks[value].alt} />
          </div>
        </div>
      </div>
    </div>
  );
}

TextBlock.propTypes = {
  children: PropTypes.node,
  right: PropTypes.bool,
  value: PropTypes.string,
  borderColor: PropTypes.string,
  underlineTitleBlue: PropTypes.string,
  underlineTitleGolden: PropTypes.string,
};
