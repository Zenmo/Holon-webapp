import PropTypes from "prop-types";
import ScenarioSlider from "./ScenarioSlider";
import ScenarioSwitch from "./ScenarioSwitch";

function Neighbourhood(props) {
  function updateValue(property, inputValue) {
    const propertyValue = typeof inputValue == "boolean" ? inputValue : parseInt(inputValue);
    props.setNeighbourhood({
      ...props.neighbourhood,
      [property]: {
        ...props.neighbourhood[property],
        value: propertyValue,
      },
    });
  }

  return (
    <div>
      <h4 className="my-4 basis-full border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-xl font-light">
        Buurt {props.neighbourhoodID}
      </h4>
      <ScenarioSlider
        scenarioId={props.scenarioId}
        neighbourhoodID={props.neighbourhoodID}
        label={props.neighbourhood.heatpump.label}
        value={props.neighbourhood.heatpump.value}
        locked={props.neighbourhoodID == "B" || props.locked ? true : false}
        inputId="heatpump"
        updateValue={updateValue}
        message="Het percentage van de huizen in de buurt die een elektrische warmtepomp hebben,"
      />
      <ScenarioSlider
        scenarioId={props.scenarioId}
        neighbourhoodID={props.neighbourhoodID}
        label={props.neighbourhood.evadoptation.label}
        value={props.neighbourhood.evadoptation.value}
        locked={props.locked}
        inputId="evadoptation"
        updateValue={updateValue}
        message="Het percentage van de auto's in de buurt dat elektrisch is."
      />
      <ScenarioSlider
        scenarioId={props.scenarioId}
        neighbourhoodID={props.neighbourhoodID}
        label={props.neighbourhood.solarpanels.label}
        value={props.neighbourhood.solarpanels.value}
        locked={props.locked}
        inputId="solarpanels"
        updateValue={updateValue}
        message="Het percentage van de huizen in de buurt die zonnepanelen heeft."
      />
      <ScenarioSwitch
        neighbourhoodID={props.neighbourhoodID}
        label={props.neighbourhood.heatnetwork.label}
        value={props.neighbourhood.heatnetwork.value}
        locked={true}
        off="nee"
        on="ja"
        scenarioId={props.scenarioId}
        inputId="heatnetwork"
        updateValue={updateValue}
        message="Als deze slider aangevinkt staat zijn alle   huizen in de buurt aangesloten op een warmtenet. Het is een   midden-temperatuur warmtenet. In de beginsituatie is de bron een gasketel. In   de warmteholon situatie is de bron een warmtepomp met elektrische piekboiler,   en een warmtebuffer die demand-response en seizoensopslag van warmte mogelijk   maakt.   "
      />
    </div>
  );
}
export default Neighbourhood;

Neighbourhood.propTypes = {
  neighbourhood: PropTypes.shape({
    heatpump: PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    }),
    evadoptation: PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    }),
    solarpanels: PropTypes.shape({
      value: PropTypes.number,
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
  scenarioId: PropTypes.string,
};
