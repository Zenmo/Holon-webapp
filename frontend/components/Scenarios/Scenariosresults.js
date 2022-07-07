import React from "react";
import Scenarioresultitem from "./Scenarioresultitem";
import Scenarioswitch from "./Scenarioswitch";

function Scenarioresults(props) {

    return (
        <React.Fragment>
            <div className="relative flex flex-col">
                {props.children}

                <div className="flex flex-wrap flex-row justify-between items-center">
                    <h3 className="text-xl mb-4" >Resultaten</h3>

                    <Scenarioswitch message="Het lokale schaalniveau laat de resultaten van   de beschreven case met twee voorbeeldbuurten zien. Het nationale schaalniveau   is een aggregatie van de indicatoren naar nationaal niveau door de buurten te   vermenigvuldigen met het aantal huizen in Nederland." text="" off="Nationaal" on="Lokaal" label="" scenarioid={props.scenarioid} inputid={`local`} value={props.local} updatevalue={props.setLocal} />


                </div>
                <div className="flex flex-wrap flex-row  gap-2 flex-nowrap">
                    <div className="basis-full lg:basis-1/2 ">
                        <h4 className="text-lg">Technisch</h4>
                        <Scenarioresultitem minvalue="0" maxvalue="100" label="Betrouwbaarheid" unit="%" value={props.reliability} local={props.local}
                            messageNl="Betrouwbaarheid wordt bepaald door overbelasting van het laagspanningsnet. Bij een negatieve indicatie wordt het net regelmatig overbelast, bij een positieve indicatie is dit geen probleem."
                            messageLocal="Betrouwbaarheid wordt bepaald door overbelasting   van het elektriciteitsnet. Bij een negatieve indicatie wordt het net   regelmatig overbelast, bij een positieve indicatie is dit geen probleem." />

                        <Scenarioresultitem minvalue="1800" maxvalue="2400" invert label="Betaalbaarheid" unit="&euro;" value={props.affordability} local={props.local}
                            messageNl="De betaalbaarheid zijn de totale energiekosten van   alle huishouden per jaar bij elkaar. Hierbij worden autobrandstoffen,   aardgas, warmte en elektriciteit meegenomen. Van de duurzame bronnen die   gebouwd worden in de buurten wordt de LCOE genomen zodat investeringen ook   meetellen in de kosten. De overige elektriciteit gaat op basis van   marktprijzen."
                            messageLocal="De betaalbaarheid zijn de energiekosten per   huishouden per jaar. Hierbij worden autobrandstoffen, aardgas, warmte en   elektriciteit meegenomen. Van de duurzame bronnen die gebouwd worden in de   buurten wordt de LCOE genomen zodat investeringen ook meetellen in de kosten.   De overige elektriciteit gaat op basis van marktprijzen." />
                    </div>
                    <div className="basis-full lg:basis-1/2">
                        <h4 className="text-lg">Financieel</h4>
                        <Scenarioresultitem minvalue="40" maxvalue="90" label="Zelfconsumptie" unit="%" value={props.selfsufficient} local={props.local}
                            messageNl="Zelfconsumptie is het aandeel van de lokaal   opgewekte energie die ook gelijktijdig lokaal gebruikt wordt. Een hoge   zelfconsumptie is nodig om netcongestie tegen te gaan door pieken in lokale   (duurzame) opwek."
                            messageLocal="Zelfconsumptie is het aandeel van de lokaal   opgewekte energie die ook gelijktijdig lokaal gebruikt wordt. Een hoge   zelfconsumptie is nodig om netcongestie tegen te gaan door pieken in lokale   (duurzame) opwek. " />
                        <Scenarioresultitem minvalue="10" maxvalue="50" label="Duurzaamheid" unit="%" value={props.sustainable} local={props.local}
                            messageNl="	et aandeel lokaal duurzaam opgewekte energie.   Het verschilt met zelfvoorziening is dat voor het aandeel duurzaamheid de   gelijktijdigheid van opwek en consumptie niet van belang is. De energie wordt   als het ware ‘gesaldeerd’."
                            messageLocal="Het aandeel lokaal duurzaam opgewekte energie.   Het verschilt met zelfvoorziening is dat voor het aandeel duurzaamheid de   gelijktijdigheid van opwek en consumptie niet van belang is. De energie wordt   als het ware ‘gesaldeerd’." />
                    </div>
                </div>
                <div className="flex flex-wrap flex-row gap-2 flex-nowrap">
                    <div className="basis-full lg:basis-1/2">
                        <h4 className="text-lg">Sociaal</h4>
                        {(props.windholon && props.heatholon) ? (
                            <p>De sociale cohesie in de buurt is vrij laag en lokaal eigenaarschap van collectieve duurzame technieken is vrijwel afwezig</p>
                        ) : props.windholon ? (
                            <p>De buurtbewoners ervaren lokaal  eigenaarschap, verdelen de kosten en baten van de windturbine eerlijk, en steunen de ruimtelijke inpassing. Wel moet voor genoeg vermogen de coöperatie flink groeien met leden die hun auto’s slim kunnen laden.</p>

                        ) : props.heatholon ? (<p>De bewoners voldoen aan hun wens om van het gas af te gaan, en creëren lokaal eigenaarschap over het net. Door de piekketel en warmtebuffer zijn de bewoners gerustgesteld over de betrouwbaarheid van het systeem.</p>
                        ) : ''
                        }
                    </div>
                    <div className="basis-full lg:basis-1/2">
                        <h4 className="text-lg">Juridisch</h4>
                        {(props.windholon && props.heatholon) ? (<p>Het systeem loopt tegen zijn grenzen aan. In deze beginsituatie is er nog geen afstemming van lokale opwek en verbruik. Op dit moment mag dat meestal ook niet. Voor een efficiënt lokaal systeem zijn nieuwe regels nodig.</p>
                        ) : props.windholon ? (<p>Flexibele tarieven voor het netwerk kunnen congestie voorkomen. Het netwerk ontlasten met slim laden in de nabijheid is juridisch complex. Nieuwe afspraken en regelingen zijn nodig om deze situatie aantrekkelijk te maken</p>

                        ) : props.heatholon ? (<p>Juridisch kan het lastig zijn om vraag en aanbod van elektriciteit en warmte lokaal af te stemmen. Samen opslaan van elektriciteit of het toepassen van spitstarieven in netten of voor warmte is nog niet voldoende geregeld. </p>
                        ) : ''
                        }
                    </div>


                </div>
            </div>
        </React.Fragment>
    );
}

export default Scenarioresults;