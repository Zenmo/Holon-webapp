import React from "react";
import PropTypes from "prop-types";

function ContentBlock(props) {
  const id = props.id ?? "";
  const bgColor = props.colorClass ?? "";
  const contentOfBlock = props.children ?? "";

  return (
    <div
      className={`min-h-screen snap-start ${bgColor} relative flex items-center justify-center`}
      id={id}
      data-testid="content-block"
    >
      {contentOfBlock}
    </div>
  );
}

export default ContentBlock;

ContentBlock.propTypes = {
  children: PropTypes.node,
  colorClass: PropTypes.string,
  id: PropTypes.string,
};
