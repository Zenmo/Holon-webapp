import React, { Children } from 'react';

export default function TextBlock(content) {

    let stylingRight = (content.right) ? "items-end text-right mr-24 border-r-8 pr-5" : "border-l-8 ml-24 pl-5"; 
    let flexValue = (content.right) ? "justify-end" : ""; 
    let value = (content.value) ? content.value : "default";   
    let borderColor = (content.borderColor) ? content.borderColor : "border-white"; 
    let extraContent = (content.children) ? content.children : ""; 
    let underlineTitle = (content.underlineTitle) ? "underline decoration-[16px] underline-offset-[-2px]" : ""; 
    let colorUnderline = (content.colorUnderline) ? content.colorUnderline : ""; 


    const texts = {
        default: {
            title: "Title of this textblock", 
            pText: "The paragraph text of this textblock"
        },
        hoeDoen: {
            title: "Hoe doen we dat nu?",
            pText: "Hiërarchie en anarchie zijn de uitersten. Ergens in het midden ligt een oplossing die het beste van beide samenbrengt tot een gebalanceerd systeem."
        },
        slimmerSamenwerken: {
            title: "Slimmer samenwerken", 
            pText: "Wind coöperatie content. Hiërarchie en anarchie zijn de uitersten. Ergens in het midden ligt een oplossing die het beste van beide samenbrengt tot een gebalanceerd systeem. "
        },
        warmte: {
            title: "Ook warmte speelt een rol", 
            pText: "Warmtenet content"
        },
        tweeKeerSlimmer: {
            title: "Twee keer slimmer", 
            pText: "Wind coöperatie EN warmtenet content."
        },
        afsluiter: {
            title: "Afsluiter en uitfluiter", 
            pText: "Hiërarchie en anarchie zijn de uitersten. Ergens in het midden ligt een oplossing die het beste van beide samenbrengt tot een gebalanceerd systeem", 
        }
    }

    return (
        <div className={`m-10 h-screen w-screen flex ${flexValue}`}>
            <div className={`w-3/4 flex flex-col border-solid ${borderColor} ${stylingRight}`}>
                <h2 className={`mt-24 text-6xl font-semibold ${underlineTitle} ${colorUnderline}`}>{texts[value]['title']}</h2>
                <p className='mt-10 w-2/4 text-lg'>{texts[value]['pText']}</p> 
                <div className="mt-24 ">
                {extraContent}
                </div>
            </div>
        </div>
    );

}
