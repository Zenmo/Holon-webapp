import React from "react";
import PropTypes from "prop-types";
import ScenarioResultItem from "./ScenarioResultItem";
import ScenarioSwitch from "./Scenarioswitch";

function ScenarioResults(props) {
  return (
    <React.Fragment>
      <div className="relative flex flex-col">
        {props.children}

        <div className="flex flex-row flex-wrap items-center justify-between">
          <h3
            className={`${props.borderColor} mb-4 border-l-[0.75rem] pl-3 text-2xl font-medium italic`}
          >
            resultaten
          </h3>
          <ScenarioSwitch
            message="Het lokale schaalniveau laat de resultaten van   de beschreven case met twee voorbeeldbuurten zien. Het nationale schaalniveau   is een aggregatie van de indicatoren naar nationaal niveau door de buurten te   vermenigvuldigen met het aantal huizen in Nederland."
            text=""
            off="Nationaal"
            on="Lokaal"
            label=""
            scenarioid={props.scenarioid}
            inputid={`local`}
            value={props.local}
            updatevalue={props.setLocal}
          />
        </div>
        <div className="flex flex-row flex-wrap">
          <h4 className="my-4 basis-full border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-xl font-light">
            Indicatoren
          </h4>
          <ScenarioResultItem
            minvalue="0"
            maxvalue="100"
            label="Betrouwbaarheid"
            unit=" " // if " " is supplied the result will be displayed as either + at 100 or - at 0
            value={props.reliability}
            local={props.local}
            messageNl="Betrouwbaarheid wordt bepaald door overbelasting van het laagspanningsnet. Bij een negatieve indicatie wordt het net regelmatig overbelast, bij een positieve indicatie is dit geen probleem."
            messageLocal="Betrouwbaarheid wordt bepaald door overbelasting   van het elektriciteitsnet. Bij een negatieve indicatie wordt het net   regelmatig overbelast, bij een positieve indicatie is dit geen probleem."
          />
          <ScenarioResultItem
            minvalue="50"
            maxvalue="90"
            label="Zelfconsumptie"
            unit="%"
            value={props.selfconsumption}
            local={props.local}
            messageNl="Zelfconsumptie is het aandeel van de lokaal   opgewekte energie die ook gelijktijdig lokaal gebruikt wordt. Een hoge   zelfconsumptie is nodig om netcongestie tegen te gaan door pieken in lokale   (duurzame) opwek."
            messageLocal="Zelfconsumptie is het aandeel van de lokaal   opgewekte energie die ook gelijktijdig lokaal gebruikt wordt. Een hoge   zelfconsumptie is nodig om netcongestie tegen te gaan door pieken in lokale   (duurzame) opwek. "
          />
          <ScenarioResultItem
            minvalue="1900"
            maxvalue="2600"
            invert
            label="Betaalbaarheid"
            unit="&euro;/hh/j"
            value={props.affordability}
            local={props.local}
            messageNl="De betaalbaarheid zijn de totale energiekosten van   alle huishouden per jaar bij elkaar. Hierbij worden autobrandstoffen,   aardgas, warmte en elektriciteit meegenomen. Van de duurzame bronnen die   gebouwd worden in de buurten wordt de LCOE genomen zodat investeringen ook   meetellen in de kosten. De overige elektriciteit gaat op basis van   marktprijzen."
            messageLocal="De betaalbaarheid zijn de energiekosten per   huishouden per jaar. Hierbij worden autobrandstoffen, aardgas, warmte en   elektriciteit meegenomen. Van de duurzame bronnen die gebouwd worden in de   buurten wordt de LCOE genomen zodat investeringen ook meetellen in de kosten.   De overige elektriciteit gaat op basis van marktprijzen."
          />
          <ScenarioResultItem
            minvalue="10"
            maxvalue="35"
            label="Duurzaamheid"
            unit="%"
            value={props.renewability}
            local={props.local}
            messageNl="Het aandeel lokaal duurzaam opgewekte energie.   Het verschilt met zelfvoorziening is dat voor het aandeel duurzaamheid de   gelijktijdigheid van opwek en consumptie niet van belang is. De energie wordt   als het ware ‘gesaldeerd’."
            messageLocal="Het aandeel lokaal duurzaam opgewekte energie.   Het verschilt met zelfvoorziening is dat voor het aandeel duurzaamheid de   gelijktijdigheid van opwek en consumptie niet van belang is. De energie wordt   als het ware ‘gesaldeerd’."
          />
        </div>
        <div className="flex flex-row flex-nowrap gap-2">
          <div className="basis-full lg:basis-1/2">
            <h4 className="my-4 basis-full border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-xl font-light">
              Sociaal
            </h4>
            {props.windholon && props.heatholon ? (
              <p className="text-lg font-light italic text-gray-800">
                Er wordt een combinatie van twee holonen gevormd. Dit is technisch efficiënt maar
                vraagt wel meer afstemming bewoners in de twee buurten. Individuele en collectieve
                belangen moeten hierbij op elkaar afgestemd zijn.
              </p>
            ) : props.windholon ? (
              <p className="text-lg font-light italic text-gray-800">
                De buurtbewoners ervaren lokaal eigenaarschap, verdelen de kosten en baten van de
                windturbine eerlijk, en steunen de ruimtelijke inpassing. Wel moet voor genoeg
                vermogen de coöperatie flink groeien met leden die hun auto’s slim kunnen laden.
              </p>
            ) : props.heatholon ? (
              <p className="text-lg font-light italic text-gray-800">
                De bewoners voldoen aan hun wens om van het gas af te gaan, en creëren lokaal
                eigenaarschap over het net. Door de piekketel en warmtebuffer zijn de bewoners
                gerustgesteld over de betrouwbaarheid van het systeem.
              </p>
            ) : (
              <p className="text-lg font-light italic text-gray-800">
                De sociale cohesie in de buurt is vrij laag en lokaal eigenaarschap van collectieve
                duurzame technieken is vrijwel afwezig.
              </p>
            )}
          </div>
          <div className="basis-full lg:basis-1/2">
            <h4 className="my-4 basis-full border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-xl font-light">
              Juridisch
            </h4>
            {props.windholon && props.heatholon ? (
              <p className="text-lg font-light italic text-gray-800">
                Samen produceren, samen opslaan en productie en gebruik op elkaar afstemmen is
                juridisch complex. Niet alles is nu mogelijk of kan alleen onder bepaalde
                voorwaarden. Het systeem zal hierop aangepast moeten worden.
              </p>
            ) : props.windholon ? (
              <p className="text-lg font-light italic text-gray-800">
                Flexibele tarieven voor het netwerk kunnen congestie voorkomen. Het netwerk
                ontlasten met slim laden in de nabijheid is juridisch complex. Nieuwe afspraken en
                regelingen zijn nodig om deze situatie aantrekkelijk te maken
              </p>
            ) : props.heatholon ? (
              <p className="text-lg font-light italic text-gray-800">
                Juridisch kan het lastig zijn om vraag en aanbod van elektriciteit en warmte lokaal
                af te stemmen. Samen opslaan van elektriciteit of het toepassen van spitstarieven in
                netten of voor warmte is nog niet voldoende geregeld.{" "}
              </p>
            ) : (
              <p className="text-lg font-light italic text-gray-800">
                Het systeem loopt tegen zijn grenzen aan. In deze beginsituatie is er nog geen
                afstemming van lokale opwek en verbruik. Op dit moment mag dat meestal ook niet.
                Voor een efficiënt lokaal systeem zijn nieuwe regels nodig.
              </p>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ScenarioResults;

ScenarioResults.propTypes = {
  children: PropTypes.object,
  local: PropTypes.object,
  borderColor: PropTypes.string,
  scenarioid: PropTypes.string,
  reliability: PropTypes.number,
  affordability: PropTypes.number,
  renewability: PropTypes.number,
  selfconsumption: PropTypes.number,
  setLocal: PropTypes.func,
  windholon: PropTypes.bool,
  heatholon: PropTypes.bool,
  right: PropTypes.string,
};
