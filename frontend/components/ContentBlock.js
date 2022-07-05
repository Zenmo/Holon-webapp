import React, { Children } from "react";
import Link from 'next/link'; 




function ContentBlock(content) {

    let id = (content.id) ? content.id : ""; 

    let bgColor = (content.colorClass) ? content.colorClass : ""; 
    let linkname = (content.linkname) ? content.linkname : ""; 
    let contentOfBlock = (content.children) ? content.children : ""; 

    return (
        
        <div className={`snap-start h-screen + ${bgColor} flex justify-center items-center`} id={id}>
            {contentOfBlock} 
        </div>
    )
}; 

export default ContentBlock; 