import React from "react";
import PropTypes from "prop-types";

const texts = {
  windHolon: {
    social:
      "De buurtbewoners ervaren lokaal eigenaarschap, verdelen de kosten en baten van de windturbine eerlijk, en steunen de ruimtelijke inpassing. Wel moet voor genoeg vermogen de coöperatie flink groeien met leden die hun auto’s slim kunnen laden.",
    legal:
      "Flexibele tarieven voor het netwerk kunnen congestie voorkomen. Het netwerk ontlasten met slim laden in de nabijheid is juridisch complex. Nieuwe afspraken en regelingen zijn nodig om deze situatie aantrekkelijk te maken.",
  },
  heatHolon: {
    social:
      "De bewoners voldoen aan hun wens om van het gas af te gaan, en creëren lokaal eigenaarschap over het net. Door de piekketel en warmtebuffer zijn de bewoners gerustgesteld over de betrouwbaarheid van het systeem.",
    legal:
      "Juridisch kan het lastig zijn om vraag en aanbod van elektriciteit en warmte lokaal af te stemmen. Samen opslaan van elektriciteit of het toepassen van spitstarieven in netten of voor warmte is nog niet voldoende geregeld.",
  },
  windAndHeatHolon: {
    social:
      "Er wordt een combinatie van twee holonen gevormd. Dit is technisch efficiënt maar vraagt wel meer afstemming bewoners in de twee buurten. Individuele en collectieve belangen moeten hierbij op elkaar afgestemd zijn.",
    legal:
      "Samen produceren, samen opslaan en productie en gebruik op elkaar afstemmen is juridisch complex. Niet alles is nu mogelijk of kan alleen onder bepaalde voorwaarden. Het systeem zal hierop aangepast moeten worden.",
  },
  noHolon: {
    social:
      " De sociale cohesie in de buurt is vrij laag en lokaal eigenaarschap van collectieve duurzame technieken is vrijwel afwezig.",
    legal:
      "Het systeem loopt tegen zijn grenzen aan. In deze beginsituatie is er nog geen afstemming van lokale opwek en verbruik. Op dit moment mag dat meestal ook niet. Voor een efficiënt lokaal systeem zijn nieuwe regels nodig.",
  },
};

function selectText(windholon, heatholon, textType) {
  let textToDisplay;

  if (windholon && heatholon) {
    textToDisplay = texts.windAndHeatHolon[textType];
  } else if (windholon) {
    textToDisplay = texts.windHolon[textType];
  } else if (heatholon) {
    textToDisplay = texts.heatHolon[textType];
  } else {
    textToDisplay = texts.noHolon[textType];
  }
  return textToDisplay;
}

function ScenarioResultText({ windholon, heatholon, textType }) {
  return (
    <p data-testid="legalText" className="text-lg font-light italic text-gray-800">
      {selectText(windholon, heatholon, textType)}
    </p>
  );
}

ScenarioResultText.propTypes = {
  windholon: PropTypes.bool,
  heatholon: PropTypes.bool,
  textType: PropTypes.string,
};

export default ScenarioResultText;
