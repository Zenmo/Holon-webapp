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
            title: "Het moet anders",
            pText: "Om aan internationale klimaatdoelen te voldoen neemt het aandeel duurzame energie toe. \n Daardoor is de productie weersafhankelijk en meer kleinschalig. Het energiesysteem verandert ingrijpend. \n Met holonen kunnen we het energiesysteem op een nieuwe manier organiseren. Holontool.nl maakt het mogelijk om dit te onderzoeken. Binnen deze demonstratie laten we dit zien aan de hand van twee voorbeeldbuurten. In de beginsituatie heeft de ene buurt een warmtenet, de andere buurt CV-ketels. We beginnen met een referentiecase om de huidige situatie inzichtelijk te krijgen. Vervolgens kijken we wat er gebeurt als de bewoners van deze case samen holonen gaan vormen, en onderling energie uitwisselen." 
        },
        slimmerSamenwerken: {
            title: "Wind", 
            pText: "Wind coöperatie content. Hiërarchie en anarchie zijn de uitersten. Ergens in het midden ligt een oplossing die het beste van beide samenbrengt tot een gebalanceerd systeem. "
        },
        warmte: {
            title: "Ook warmte speelt een rol", 
            pText: "Warmtenet content. Hiërarchie en anarchie zijn de uitersten. Ergens in het midden ligt een oplossing die het beste van beide samenbrengt tot een gebalanceerd systeem."
        },
        tweeKeerSlimmer: {
            title: "Twee keer slimmer", 
            pText: "Wind coöperatie EN warmtenet content. Hiërarchie en anarchie zijn de uitersten. Ergens in het midden ligt een oplossing die het beste van beide samenbrengt tot een gebalanceerd systeem."
        },
        afsluiter: {
            title: "Afsluiter en uitfluiter", 
            pText: "Hiërarchie en anarchie zijn de uitersten. Ergens in het midden ligt een oplossing die het beste van beide samenbrengt tot een gebalanceerd systeem", 
        }
    }

    function createParagraphs(texts) {
        const paragraphs = texts.split('\n').map(str => <p className="mt-4">{str}</p>);
        return paragraphs;  
    }; 

    return (
        <div className={`m-10 h-screen w-screen flex ${flexValue}`}>
            <div className={`w-3/4 flex flex-col border-solid ${borderColor} ${stylingRight}`}>
                <h2 className={`mt-24 text-6xl font-semibold ${underlineTitle} ${colorUnderline}`}>{texts[value]['title']}</h2>
                <div className='mt-10 w-2/4 text-lg'>{createParagraphs(texts[value]['pText'])}</div> 
                <div className="mt-24 ">
                {extraContent}
                </div>
            </div>
        </div>
    );

}
