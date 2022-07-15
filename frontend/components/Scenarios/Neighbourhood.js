import PropTypes from "prop-types";
import ScenarioSlider from "./Scenarioslider";
import ScenarioSwitch from "./Scenarioswitch";

function Neighbourhood(props) {
  function updateValue(property, inputvalue) {
    props.neighbourhood[property].value = inputvalue;
    props.setNeighbourhood({ ...props.neighbourhood, property: props.neighbourhood[property] });
  }

  return (
    <div>
      <h4 className="my-4 basis-full border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-xl font-light">
        Buurt {props.neighbourhoodID}
      </h4>
      <ScenarioSlider
        scenarioid={props.scenarioid}
        neighbourhoodID={props.neighbourhoodID}
        label={props.neighbourhood.heatpump.label}
        value={props.neighbourhood.heatpump.value}
        locked={props.neighbourhoodID == "B" || props.locked ? true : false}
        inputid="heatpump"
        updatevalue={updateValue}
        message="Het percentage van de huizen in de buurt die een elektrische warmtepomp hebben,"
      />
      <ScenarioSlider
        scenarioid={props.scenarioid}
        neighbourhoodID={props.neighbourhoodID}
        label={props.neighbourhood.evadoptation.label}
        value={props.neighbourhood.evadoptation.value}
        locked={props.locked}
        inputid="evadoptation"
        updatevalue={updateValue}
        message="Het percentage van de auto's in de buurt dat elektrisch is."
      />
      <ScenarioSlider
        scenarioid={props.scenarioid}
        neighbourhoodID={props.neighbourhoodID}
        label={props.neighbourhood.solarpanels.label}
        value={props.neighbourhood.solarpanels.value}
        locked={props.locked}
        inputid="solarpanels"
        updatevalue={updateValue}
        message="Het percentage van de huizen in de buurt die zonnepanelen heeft."
      />
      <ScenarioSwitch
        neighbourhoodID={props.neighbourhoodID}
        label={props.neighbourhood.heatnetwork.label}
        value={props.neighbourhood.heatnetwork.value}
        locked={true}
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

Neighbourhood.propTypes = {
  neighbourhood: PropTypes.shape({
    heatpump: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    evadoptation: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    solarpanels: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    heatnetwork: PropTypes.shape({
      value: PropTypes.bool,
      label: PropTypes.string,
    }),
  }),
  neighbourhoodID: PropTypes.string,
  locked: PropTypes.bool,
  setNeighbourhood: PropTypes.func,
  scenarioid: PropTypes.string,
};
