import ScenarioResultItem from "./ScenarioResultItem";
import ScenarioSwitch from "./ScenarioSwitch";
import ScenarioResultText from "./ScenarioResultText";
import Collapsible from "./Collapsible";

import { SubjectResult } from "./types";

type Props = React.PropsWithChildren<{
  affordability: SubjectResult;
  borderColor?: string;
  heatholon: boolean;
  local: boolean;
  reliability: SubjectResult;
  renewability: SubjectResult;
  right?: string;
  scenarioId: string;
  selfconsumption: SubjectResult;
  setLocal: React.ComponentProps<typeof ScenarioSwitch>["updateValue"];
  windholon: boolean;
}>;

export default function ScenarioResults(props: Props) {
  return (
    <>
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
            off="Nationaal"
            on="Lokaal"
            label=""
            scenarioId={props.scenarioId}
            inputId={`local`}
            value={props.local}
            updateValue={props.setLocal}
          />
        </div>
        <div className="flex flex-row flex-wrap">
          <h4 className="my-4 basis-full border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-xl font-light">
            Indicatoren
          </h4>
          <ScenarioResultItem
            minvalue={0}
            maxvalue={100}
            label="Betrouwbaarheid"
            unit=" " // if " " is supplied the result will be displayed as either + at 100 or - at 0
            value={props.reliability}
            local={props.local}
            messageNl="Betrouwbaarheid wordt bepaald door overbelasting van het laagspanningsnet. Bij een negatieve indicatie wordt het net regelmatig overbelast, bij een positieve indicatie is dit geen probleem."
            messageLocal="Betrouwbaarheid wordt bepaald door overbelasting   van het elektriciteitsnet. Bij een negatieve indicatie wordt het net   regelmatig overbelast, bij een positieve indicatie is dit geen probleem."
          />
          <ScenarioResultItem
            minvalue={50}
            maxvalue={90}
            label="Zelfconsumptie"
            unit="%"
            value={props.selfconsumption}
            local={props.local}
            messageNl="Zelfconsumptie is het aandeel van de lokaal   opgewekte energie die ook gelijktijdig lokaal gebruikt wordt. Een hoge   zelfconsumptie is nodig om netcongestie tegen te gaan door pieken in lokale   (duurzame) opwek."
            messageLocal="Zelfconsumptie is het aandeel van de lokaal   opgewekte energie die ook gelijktijdig lokaal gebruikt wordt. Een hoge   zelfconsumptie is nodig om netcongestie tegen te gaan door pieken in lokale   (duurzame) opwek. "
          />
          <ScenarioResultItem
            minvalue={1900}
            maxvalue={2600}
            invert
            label="Betaalbaarheid"
            unit="&euro;/hh/j"
            value={props.affordability}
            local={props.local}
            messageNl="De betaalbaarheid zijn de totale energiekosten van   alle huishouden per jaar bij elkaar. Hierbij worden autobrandstoffen,   aardgas, warmte en elektriciteit meegenomen. Van de duurzame bronnen die   gebouwd worden in de buurten wordt de LCOE genomen zodat investeringen ook   meetellen in de kosten. De overige elektriciteit gaat op basis van   marktprijzen."
            messageLocal="De betaalbaarheid zijn de energiekosten per   huishouden per jaar. Hierbij worden autobrandstoffen, aardgas, warmte en   elektriciteit meegenomen. Van de duurzame bronnen die gebouwd worden in de   buurten wordt de LCOE genomen zodat investeringen ook meetellen in de kosten.   De overige elektriciteit gaat op basis van marktprijzen."
          />
          <ScenarioResultItem
            minvalue={10}
            maxvalue={35}
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
            <Collapsible label="Sociaal">
              <ScenarioResultText
                windholon={props.windholon}
                heatholon={props.heatholon}
                textType="social"
              />
            </Collapsible>
          </div>
          <div className="basis-full lg:basis-1/2">
            <Collapsible label="Juridisch">
              <ScenarioResultText
                windholon={props.windholon}
                heatholon={props.heatholon}
                textType="legal"
              />
            </Collapsible>
          </div>
        </div>
      </div>
    </>
  );
}
