import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";

import { ContentTextBlocks } from "./ContentTextBlocks.js";
import CreateParagraphs from "./CreateParagraphs";

export default function TextBlock(props) {
  let stylingRight = props.right
    ? "items-end text-right mr-24 border-r-8 pr-5"
    : "border-l-8 ml-24 pl-5";
  let imageTextFlex = props.right ? "flex-row-reverse" : "flex-row";
  let flexValue = props.right ? "justify-end" : "";
  let value = props.value ? props.value : "default";
  let borderColor = props.borderColor ? props.borderColor : "border-white";
  let extraContent = props.children ? props.children : "";
  let underlineTitleBlue = props.underlineTitleBlue ? "shadow-blue" : "";
  let underlineTitleGolden = props.underlineTitleGolden ? props.underlineTitleGolden : "";

  return (
    <div className={`mx-10 flex min-h-screen w-screen ${flexValue}`} data-testid="text-block">
      <div
        className={`flex w-full flex-col border-solid ${borderColor} ${stylingRight}`}
        data-testid="outlined-block"
      >
        <h2
          className={`mt-24 text-6xl font-semibold ${underlineTitleBlue} ${underlineTitleGolden}`}
        >
          {ContentTextBlocks[value].title}
        </h2>
        <div className={`mt-10 flex ${imageTextFlex} gap-20 align-middle`}>
          <div className="flex w-5/12 flex-col">
            <div className="text-lg">
              <CreateParagraphs texts={ContentTextBlocks[value].pText} />
            </div>
            <div className="mt-24 flex gap-4">{extraContent}</div>
          </div>
          <div className="w-7/12 p-10">
            <Image src={ContentTextBlocks[value].img} alt={ContentTextBlocks[value].alt} />
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
