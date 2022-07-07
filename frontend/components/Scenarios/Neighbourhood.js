import ScenarioSlider from "./Scenarioslider";
import Scenarioswitch from "./Scenarioswitch";


function Neighbourhood(props) {

    function updateValue(property, value) {
        props.neighbourhood[property] = value
        props.setNeighbourhood({ ...props.neighbourhood, property: value })
    }

    return (
        <div>
            <h4 className="text-lg">Buurt {props.label}</h4>
            <ScenarioSlider label={props.label} disabled={props.locked} inputid="heatpump" value={props.neighbourhood.heatpump} updatevalue={updateValue} />
            <ScenarioSlider label={props.label} disabled={props.locked} inputid="evadoptation" value={props.neighbourhood.evadoptation} updatevalue={updateValue} />
            <ScenarioSlider label={props.label} disabled={props.locked} inputid="solarpanels" value={props.neighbourhood.solarpanels} updatevalue={updateValue} />
            <Scenarioswitch label={props.label} disabled={props.locked} off="nee" on="ja" inputid="heatnetwork" value={props.neighbourhood.heatnetwork} updatevalue={updateValue} />
        </div>
    );
};
export default Neighbourhood;