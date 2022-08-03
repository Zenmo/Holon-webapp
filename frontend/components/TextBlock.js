import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";

import overview from "../public/imgs/Overview.svg";
import expansionproblem_w_wind from "../public/imgs/Expansion Problem Windholon.svg";
import heatholon from "../public/imgs/Warmteholon.svg";
import animation from "../public/imgs/Sprint-6-Case-animation.gif";
import netherlandspuzzle from "../public/imgs/Nederland met Holonen.svg";

export default function TextBlock(props) {
  let stylingRight = props.right
    ? "items-end text-right mr-24 border-r-8 pr-5"
    : "border-l-8 ml-24 pl-5";
  let imageTextFlex = props.right ? "flex-row-reverse" : "flex-row";
  let flexValue = props.right ? "justify-end" : "";
  let value = props.value ? props.value : "default";
  let borderColor = props.borderColor ? props.borderColor : "border-white";
  let extraContent = props.children ? props.children : "";
  let underlineTitleBlue = props.underlineTitleBlue ? "shadow-blue" : "";
  let underlineTitleGolden = props.underlineTitleGolden ? props.underlineTitleGolden : "";

  const texts = {
    default: {
      title: "Title of this textblock",
      pText: "The paragraph text of this textblock",
    },
    hoeDoen: {
      title: "Het moet anders",
      pText:
        "Om aan internationale klimaatdoelen te voldoen neemt het aandeel duurzame energie toe. Met meer lokale autonomie kunnen we draagvlak vergroten en knelpunten als een overbelast elektriciteitsnet aanpakken. Wij laten ons daarbij inspireren door het concept holarchie. \nHolontool.nl maakt het mogelijk om dit te onderzoeken. Deze demo laat aan de hand van twee voorbeeldbuurten zien wat er gebeurt als de bewoners van deze buurten samen een zogenaamde holon vormen: een semi-autonoom energiesysteem. Zo kunnen ze bijvoorbeeld meer duurzame energie inzetten en toch de netbelasting verlagen.\nIn de beginsituatie heeft buurt A een traditioneel warmtenet en buurt B CV-ketels. Veel bewoners hebben bovendien zonnepanelen en een elektrische auto. Scroll verder om de uitgangspunten en resultaten van de beginsituatie te bekijken.",
    },
    slimmerSamenwerken: {
      title: "De windcoöperatie",
      pText:
        "De buurtbewoners willen meer duurzame energie opwekken. Hiervoor hebben zij een energiecoöperatie gevormd en investeren ze in een windturbine. Wegens transportschaarste op het hoogspanningsnet krijgen ze geen aansluiting op het elektriciteitsnet.\nAls oplossing wil de windcoöperatie lokale flexibiliteit inzetten zodat de productie van de windturbine zo veel mogelijk meteen lokaal gebruikt wordt. De buurtbewoners bekijken of ze de transformator kunnen ontlasten door hun elektrische auto's te laden wanneer er een overschot windenergie is.",
    },
    warmte: {
      title: "De rol van warmte",
      pText:
        "Het warmtenet van buurt B wordt in de beginsituatie verwarmd met een gasketel. De buurtbewoners willen graag van het gas af. Ze vomen een coöperatie die het warmtenet overneemt en vervangen de centrale gasketel door een warmtepomp. Ter ondersteuning van deze nieuwe techniek plaatsen de bewoners ook een warmtebuffer.\nDe bewoners willen hun warmtevraag zo duurzaam en lokaal mogelijk voldoen met hun eigen zonnepanelen. Daarvoor gebruiken de bewoners een slimme centrale aansturing. Deze zet alle lokaal overtollige zonne-energie in om de warmtebuffer te vullen met de warmtepomp en bij extreme zonnepieken met directe elektrische verwarming.",
    },
    tweeKeerSlimmer: {
      title: "Twee keer slimmer",
      pText:
        "Uit een haalbaarheidsstudie van de windcoöperatie blijkt dat ze niet voldoende lokale vraag kunnen sturen om het netwerk voldoende te ontlasten om een netaansluiting voor de windturbine te krijgen. Daarnaast draait de warmtepomp in buurt B nog regelmatig op grijze stroom. Daarom slaan de warmtecoöperatie en de windcoöperatie de handen in een. Zo creëren ze een samenwerking van holonen.\nIn deze samenkomst van de warmte- en windholon worden overschotten van duurzame energie lokaal slim ingezet. Warmte wordt gebufferd in de warmtebuffer en de elektrische auto's stemmen hun laadgedrag af op de overschotten.",
    },
    afsluiter: {
      title: "Het kan anders",
      pText:
        "Slim samenwerken in en tussen holonen kan helpen. De netten worden minder belast en er is meer ruimte voor lokaal eigenaarschap en energiecoöperaties.\nEchter, het creëren van een holon heeft vele uitdagingen. Niet alleen technisch maar ook juridisch, sociaal en economisch. \nOpen het model om hier zelf mee te spelen of laat je email achter en blijf op de hoogte.",
    },
  };

  const images = {
    default: {
      img: "",
      alt: "",
    },
    hoeDoen: {
      img: overview,
      alt: "schematisch overzicht huidig energiesysteem",
    },
    slimmerSamenwerken: {
      img: expansionproblem_w_wind,
      alt: "schematisch overzicht probleem en mogelijkheden windcoöperatie",
    },
    warmte: {
      img: heatholon,
      alt: "schematisch overzicht mogelijkheden slim samenwerken met warmte",
    },
    tweeKeerSlimmer: {
      img: animation,
      alt: "schematisch overzicht samenkomst warmte- en windcoorporatie",
    },
    afsluiter: {
      img: netherlandspuzzle,
      alt: "Nederland en de puzzel van lokale autonomie",
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
    <div className={`mx-10 flex min-h-screen w-screen ${flexValue}`} data-testid="text-block">
      <div
        className={`flex w-full flex-col border-solid ${borderColor} ${stylingRight}`}
        data-testid="outlined-block"
      >
        <h2
          className={`mt-24 text-6xl font-semibold ${underlineTitleBlue} ${underlineTitleGolden}`}
        >
          {texts[value]["title"]}
        </h2>
        <div className={`mt-10 flex ${imageTextFlex} gap-20 align-middle`}>
          <div className="flex w-5/12 flex-col">
            <div className="text-lg">{createParagraphs(texts[value]["pText"])}</div>
            <div className="mt-24 flex gap-4">{extraContent}</div>
          </div>
          <div className="w-7/12 p-10">
            <Image src={images[value].img} alt={images[value].alt} />
          </div>
        </div>
      </div>
    </div>
  );
}

TextBlock.propTypes = {
  children: PropTypes.node,
  right: PropTypes.bool,
  value: PropTypes.string,
  borderColor: PropTypes.string,
  underlineTitleBlue: PropTypes.string,
  underlineTitleGolden: PropTypes.string,
};
