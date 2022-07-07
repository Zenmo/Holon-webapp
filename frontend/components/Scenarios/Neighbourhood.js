import ScenarioSlider from "./ScenarioSlider";
import Scenarioswitch from "./ScenarioSwitch";

function Neighbourhood(props) {
  function updateValue(property, value) {
    props.neighbourhood[property] = value;
    props.setNeighbourhood({ ...props.neighbourhood, property: value });
  }

  return (
    <div>
      <h4 className="my-4 basis-full border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-xl font-light">
        Buurt {props.neighbourhoodID}
      </h4>
      <ScenarioSlider
        neighbourhoodID={props.neighbourhoodID}
        label={props.neighbourhood.heatpump.label}
        value={props.neighbourhood.heatpump.value}
        disabled={props.locked}
        inputid="heatpump"
        updatevalue={updateValue}
        message="Het percentage van de huizen in de buurt die een elektrische warmtepomp hebben,"
      />
      <ScenarioSlider
        neighbourhoodID={props.neighbourhoodID}
        label={props.neighbourhood.evadoptation.label}
        value={props.neighbourhood.evadoptation.value}
        disabled={props.locked}
        inputid="evadoptation"
        updatevalue={updateValue}
        message="Het percentage van de auto's in de buurt dat elektrisch is."
      />
      <ScenarioSlider
        neighbourhoodID={props.neighbourhoodID}
        label={props.neighbourhood.solarpanels.label}
        value={props.neighbourhood.solarpanels.value}
        disabled={props.locked}
        inputid="solarpanels"
        updatevalue={updateValue}
        message="Het percentage van de huizen in de buurt die zonnepanelen heeft."
      />
      <Scenarioswitch
        neighbourhoodID={props.neighbourhoodID}
        label={props.neighbourhood.heatnetwork.label}
        value={props.neighbourhood.heatnetwork.value}
        disabled={props.locked}
        off="nee"
        on="ja"
        scenarioid={props.scenarioid}
        inputid="heatnetwork"
        updatevalue={updateValue}
        message="Als deze slider aangevinkt staat zijn alle   huizen in de buurt aangesloten op een warmtenet. Het is een   midden-temperatuur warmtenet. In de beginsituatie is de bron een gasketel. In   de warmteholon situatie is de bron een warmtepomp met elektrische piekboiler,   en een warmtebuffer die demand-response en seizoensopslag van warmte mogelijk   maakt.   "
      />
    </div>
  );
}
export default Neighbourhood;
