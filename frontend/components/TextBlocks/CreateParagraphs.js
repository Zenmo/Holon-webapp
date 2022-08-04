import React from "react";

export default function createParagraphs(props) {
  const paragraphs = props.texts.split("\n").map((str, index) => (
    <p key={index} data-testid="p" className="mt-4">
      {str}
    </p>
  ));
  return paragraphs;
}
