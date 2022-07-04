import React from "react";
import Button from "../Button";
import Scenarioresultitem from "./Scenarioresultitem";
import Scenarioswitch from "./Scenarioswitch";

function Scenarioresults(props) {

    return (
        <React.Fragment>
            <div className="relative flex flex-col">
                {props.children}

                <div className="flex flex-wrap flex-row justify-between items-center">
                    <h3 className="text-xl mb-4" >Resultaten</h3>
                    <Scenarioswitch off="Nationaal" on="Lokaal" label="" inputid="local" value={props.local} updatevalue={props.setLocal} />
                </div>
                <div className="flex flex-wrap flex-row  gap-2 flex-nowrap">
                    <div className="basis-full lg:basis-1/2 ">
                        <h4>Technisch</h4>
                        <Scenarioresultitem tooltip="Lorem ipsum tooltip" label="Betrouwbaarheid" unit="%" value={props.reliability} />
                        <Scenarioresultitem label="Betaalbaarheid" unit="&euro;" value={props.affordability} />
                    </div>
                    <div className="basis-full lg:basis-1/2">
                        <h4>Financieel</h4>
                        <Scenarioresultitem label="Energieverbruik" unit="MWh" value={props.energyconsumption} />
                        <Scenarioresultitem label="Zelfvoorzienend" unit="%" value={props.selfsufficient} />
                    </div>
                </div>
                <div className="flex flex-wrap flex-row gap-2 flex-nowrap">
                    <div className="basis-full lg:basis-1/2">
                        <h4 className="text-lg">Sociaal</h4>
                        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
                    </div>
                    <div className="basis-full lg:basis-1/2">
                        <h4 className="text-lg">Juridisch</h4>
                        <p>Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat</p>
                    </div>


                </div>
            </div>
        </React.Fragment>
    );
}

export default Scenarioresults;