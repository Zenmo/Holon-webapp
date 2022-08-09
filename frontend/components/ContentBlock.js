import React from "react";
import PropTypes from "prop-types";

function ContentBlock(props) {
  let id = props.id ? props.id : "";
  let bgColor = props.colorClass ? props.colorClass : "";
  let contentOfBlock = props.children ? props.children : "";

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
