import React from "react";

function ContentBlock(content) {
  let id = content.id ? content.id : "";

  let bgColor = content.colorClass ? content.colorClass : "";
  let contentOfBlock = content.children ? content.children : "";

  return (
    <div className={`min-h-screen snap-start ${bgColor} flex items-center justify-center`} id={id}>
      {contentOfBlock}
    </div>
  );
}

export default ContentBlock;
