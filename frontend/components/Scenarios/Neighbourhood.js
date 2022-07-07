import ScenarioSlider from "./Scenarioslider";
import Scenarioswitch from "./Scenarioswitch";

function Neighbourhood(props) {
  function updateValue(property, value) {
    props.neighbourhood[property] = value;
    props.setNeighbourhood({ ...props.neighbourhood, property: value });
  }

  return (
    <div>
      <h4 className="text-lg">Buurt {props.label}</h4>
      <ScenarioSlider
        neighbourhoodID={props.neighbourhoodID}
        text="warmtepompen"
        label={props.label}
        disabled={props.locked}
        inputid="heatpump"
        value={props.neighbourhood.heatpump}
        updatevalue={updateValue}
        message="Het percentage van de huizen in de buurt die een elektrische warmtepomp hebben,"
      />
      <ScenarioSlider
        neighbourhoodID={props.neighbourhoodID}
        text="Elektrische auto's"
        label={props.label}
        disabled={props.locked}
        inputid="evadoptation"
        value={props.neighbourhood.evadoptation}
        updatevalue={updateValue}
        message="Het percentage van de auto's in de buurt dat elektrisch is."
      />
      <ScenarioSlider
        neighbourhoodID={props.neighbourhoodID}
        text="Zonnepanelen"
        label={props.label}
        disabled={props.locked}
        inputid="solarpanels"
        value={props.neighbourhood.solarpanels}
        updatevalue={updateValue}
        message="Het percentage van de huizen in de buurt die zonnepanelen heeft."
      />
      <Scenarioswitch
        neighbourhoodID={props.neighbourhoodID}
        text="Warmtenet"
        label={props.label}
        disabled={props.locked}
        off="nee"
        on="ja"
        scenarioid={props.scenarioid}
        inputid="heatnetwork"
        value={props.neighbourhood.heatnetwork}
        updatevalue={updateValue}
        message="Als deze slider aangevinkt staat zijn alle   huizen in de buurt aangesloten op een warmtenet. Het is een   midden-temperatuur warmtenet. In de beginsituatie is de bron een gasketel. In   de warmteholon situatie is de bron een warmtepomp met elektrische piekboiler,   en een warmtebuffer die demand-response en seizoensopslag van warmte mogelijk   maakt.   "
      />
    </div>
  );
}
export default Neighbourhood;
