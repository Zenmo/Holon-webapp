import React from "react";
import PropTypes from "prop-types";

export default function createParagraphs({ texts }) {
  const paragraphs = texts.split("\n").map((str, index) => (
    <p key={index} data-testid="p" className="mt-4">
      {str}
    </p>
  ));
  return paragraphs;
}

createParagraphs.propTypes = {
  texts: PropTypes.string,
};
