import React from "react";
import Image from "next/image";

import expansionproblem from "../public/imgs/Expansion Problem Windholon.svg";

export default function TextBlock(content) {
  let stylingRight = content.right
    ? "items-end text-right mr-24 border-r-8 pr-5"
    : "border-l-8 ml-24 pl-5";
  let imageTextFlex = content.right ? "flex-row-reverse" : "flex-row";
  let flexValue = content.right ? "justify-end" : "";
  let value = content.value ? content.value : "default";
  let borderColor = content.borderColor ? content.borderColor : "border-white";
  let extraContent = content.children ? content.children : "";
  let underlineTitle = content.underlineTitle ? "shadow-blue" : "";
  let colorUnderline = content.colorUnderline ? content.colorUnderline : "";

  const texts = {
    default: {
      title: "Title of this textblock",
      pText: "The paragraph text of this textblock",
    },
    hoeDoen: {
      title: "Het moet anders",
      pText:
        "Om aan internationale klimaatdoelen te voldoen neemt het aandeel duurzame energie toe. Daardoor wordt de productie weersafhankelijk en meer kleinschalig. Het energiesysteem verandert ingrijpend. Met holonen kunnen we het energiesysteem op een nieuwe manier organiseren, waar deelnemers ook zelf verantwoordelijkheden hebben. \nHolontool.nl maakt het mogelijk om dit te onderzoeken. Deze demo laat aan de hand van twee voorbeeldbuurten zien wat er gebeurt als de bewoners van deze buurten samen holonen gaan vormen.\nIn de beginsituatie heeft buurt A een traditioneel warmtenet en buurt B CV-ketels. Veel bewoners hebben bovendien zonnepanelen en een elektrische auto. Scroll verder om de uitgangspunten en resultaten van de beginsituatie te bekijken.",
    },
    slimmerSamenwerken: {
      title: "De windcoöperatie",
      pText:
        "De buurtbewoners willen meer duurzame energie opwekken. Hiervoor hebben zij een energiecoöperatie gevormd en investeren ze in een windturbine. Wegens transportschaarste op het hoogspanningsnet krijgen ze geen aansluiting op het elektriciteitsnet.\nAls oplossing wil de windcoöperatie lokale flexibiliteit inzetten zodat de productie van de windturbine zo veel mogelijk meteen lokaal gebruikt wordt. De buurtbewoners bekijken of ze de transformator kunnen ontlasten door hun elektrische auto's te laden wanneer er een overschot windenergie is.",
    },
    warmte: {
      title: "Ook warmte een rol",
      pText:
        "Het warmtenet van buurt B wordt in de beginsituatie verwarmd met een gasketel. De buurtbewoners willen graag van het gas af. Dit realiseren ze door met elkaar een coöperatie te vormen en het warmtenet over te nemen. De centrale gasketel wordt vervangen door een warmtepomp. Ter ondersteuning van deze nieuwe techniek plaatsen de bewoners ook een piekketel en een warmtebuffer.\nDe bewoners willen hun warmtevraag zo duurzaam en lokaal mogelijk voldoen met hun eigen zonnepanelen. Daarvoor gebruiken de bewoners een slimme centrale aansturing. Deze zet alle lokaal overtollige zonne-energie in om de warmtebuffer te vullen met de warmtepomp.",
    },
    tweeKeerSlimmer: {
      title: "Twee keer slimmer",
      pText:
        "Uit een haalbaarheidsstudie van de windcoöperatie blijkt dat ze niet voldoende lokale vraag kunnen sturen om het netwerk voldoende te ontlasten om een netaansluiting voor de windturbine te krijgen. Daarnaast draait de warmtepomp in buurt B nog regelmatig op grijze stroom. Daarom slaan de warmtecoöperatie en de windcoöperatie de handen in een. Zo creëren ze een samenwerking van holonen.\nIn deze samenkomst van de warmte- en windholon worden overschotten van duurzame energie lokaal slim ingezet. Warmte wordt gebufferd in de warmtebuffer en de elektrische auto's stemmen hun laadgedrag af op de overschotten.",
    },
    afsluiter: {
      title: "Het kan anders",
      pText:
        "Slim samenwerken in en tussen holonen kan helpen. De netten worden minder belast en er is meer ruimte voor lokaal eigenaarschap en energiecoöperaties.\nEchter, het creëren van een holon heeft vele uitdagingen. Van technische aansturing tot juridische mogelijkheden.\nOpen het model om hier zelf mee te spelen of laat je email achter en blijf op de hoogte.",
    },
  };

  function createParagraphs(texts) {
    const paragraphs = texts.split("\n").map((str, index) => (
      <p key={index} className="mt-4">
        {str}
      </p>
    ));
    return paragraphs;
  }

  return (
    <div className={`mx-10 flex h-screen w-screen ${flexValue}`}>
      <div className={`flex w-10/12 flex-col border-solid ${borderColor} ${stylingRight}`}>
        <h2 className={`mt-24 text-6xl font-semibold ${underlineTitle} ${colorUnderline}`}>
          {texts[value]["title"]}
        </h2>
        <div className={`mt-10 flex ${imageTextFlex} gap-20 align-middle`}>
          <div className="w-1/2 text-lg">{createParagraphs(texts[value]["pText"])}</div>
          <div className="mt-10 w-1/2">
            <Image src={expansionproblem} />
          </div>
        </div>
      </div>
    </div>
  );
}
