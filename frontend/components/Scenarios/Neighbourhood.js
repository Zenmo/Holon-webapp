import ScenarioSlider from "./Scenarioslider";
import Scenarioswitch from "./Scenarioswitch";

function Neighbourhood(props) {
  function updateValue(property, value) {
    props.neighbourhood[property] = value;
    props.setNeighbourhood({ ...props.neighbourhood, property: value });
  }

  return (
    <div>
      <h4 className="text-lg">Buurt {props.neighbourhoodID}</h4>
      <ScenarioSlider
        neighbourhoodID={props.neighbourhoodID}
        disabled={props.locked}
        inputid="heatpump"
        value={props.neighbourhood.heatpump.value}
        label={props.neighbourhood.heatpump.label}
        updatevalue={updateValue}
      />
      <ScenarioSlider
        neighbourhoodID={props.neighbourhoodID}
        disabled={props.locked}
        inputid="evadoptation"
        value={props.neighbourhood.evadoptation.value}
        label={props.neighbourhood.evadoptation.label}
        updatevalue={updateValue}
      />
      <ScenarioSlider
        neighbourhoodID={props.neighbourhoodID}
        disabled={props.locked}
        inputid="solarpanels"
        value={props.neighbourhood.solarpanels.value}
        label={props.neighbourhood.solarpanels.label}
        updatevalue={updateValue}
      />
      <Scenarioswitch
        neighbourhoodID={props.neighbourhoodID}
        disabled={props.locked}
        off="nee"
        on="ja"
        inputid="heatnetwork"
        value={props.neighbourhood.heatnetwork.value}
        label={props.neighbourhood.heatnetwork.label}
        updatevalue={updateValue}
      />
    </div>
  );
}
export default Neighbourhood;
