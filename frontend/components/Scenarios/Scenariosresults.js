import React from "react";
import Scenarioresultitem from "./Scenarioresultitem";
import Scenarioswitch from "./Scenarioswitch";

function Scenarioresults(props) {
  return (
    <React.Fragment>
      <div className="relative flex flex-col">
        {props.children}

        <div className="flex flex-row flex-wrap items-center justify-between">
          <h3
            className={`${props.borderColor} mb-4 border-l-[0.75rem] pl-3 text-2xl font-medium italic`}
          >
            Resultaten
          </h3>

          <Scenarioswitch
            off="Nationaal"
            on="Lokaal"
            label=""
            inputid="local"
            value={props.local}
            updatevalue={props.setLocal}
          />
        </div>
        <div className="flex flex-row flex-wrap">
          <h4 className="my-4 basis-full border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-xl font-light">
            Indicatoren
          </h4>
          <Scenarioresultitem
            tooltip="Lorem ipsum tooltip"
            label="Betrouwbaarheid"
            unit="-"
            value={props.reliability}
            local={props.local}
          />

          <Scenarioresultitem
            label="Zelfconsumptie"
            unit="%"
            value={props.selfconsumption}
            local={props.local}
          />
          <Scenarioresultitem
            label="Betaalbaarheid"
            unit="&euro;"
            value={props.affordability}
            local={props.local}
          />
          <Scenarioresultitem
            label="Duurzaamheid"
            unit="%"
            value={props.renewability}
            local={props.local}
          />
        </div>
        <div className="flex flex-row flex-nowrap gap-2">
          <div className="basis-full lg:basis-1/2">
            <h4 className="my-4 border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-xl font-light">
              Sociaal
            </h4>
            <p className="font-ligt text-lg italic text-gray-700">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum.{" "}
            </p>
          </div>
          <div className="basis-full lg:basis-1/2">
            <h4 className="my-4 border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-xl font-light">
              Juridisch
            </h4>
            <p className="font-ligt text-lg italic text-gray-700">
              Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum.
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Scenarioresults;
