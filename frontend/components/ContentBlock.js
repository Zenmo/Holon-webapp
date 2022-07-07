import React from "react";

function ContentBlock(content) {

    let id = (content.id) ? content.id : "";

    let bgColor = (content.colorClass) ? content.colorClass : "";
    let contentOfBlock = (content.children) ? content.children : "";

    return (

        <div className={`snap-start h-screen ${bgColor} flex justify-center items-center relative`} id={id}>
            {contentOfBlock}
        </div>
    )
};

export default ContentBlock;