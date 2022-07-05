import React from "react";
import Link from 'next/link'; 
import Button from './Button'; 




function ContentBlock(content) {

    let styling = (content.styling) ? content.styling : ""; 

    let id = (content.id) ? content.id : ""; 

    let bgColor = content.colorClass; 
    let linkname = (content.linkname) ? content.linkname : ""; 

    return (
        
        <div className={`snap-start h-screen + ${bgColor} flex justify-center items-center`} id={id}>
            <p className="text-lg">Er is hier een voorbeeldtekst met een 
            <Link href={linkname}> link
            </Link></p>
        </div>
    )
}; 

export default ContentBlock; 