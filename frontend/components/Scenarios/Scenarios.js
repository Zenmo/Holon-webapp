import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import ScenarioResults from "./ScenarioResults";
import HolonButton from "../Buttons/HolonButton";
import Loader from "./Loader";
import Neighbourhood from "./Neighbourhood";
import Tooltip from "./Tooltip";
import ProgressBar from "./ProgressBar";

function Scenarios({
  neighbourhood1: initialNeighbourhood1,
  neighbourhood2: initialNeighbourhood2,
  heatholon: initialHeatholon = false,
  windholon: initialWindholon = false,
  calculationresults: initialCalculationResults,
  right,
  borderColor,
  scenarioid,
  locked,
  scenarioTitle,
}) {
  const [loading, setLoading] = useState(false);

  const [uncalculatedScenario, setUncalculatedScenario] = useState(false);

  const [neighbourhood1, setNeighbourhood1] = useState(initialNeighbourhood1);
  const [neighbourhood2, setNeighbourhood2] = useState(initialNeighbourhood2);

  const [heatholon, setHeatholon] = useState(initialHeatholon);
  const [windholon, setWindholon] = useState(initialWindholon);

  const [local, setLocal] = useState(true);

  const [reliability, setReliability] = useState({});
  const [selfconsumption, setSelfconsumption] = useState({});
  const [affordability, setAffordability] = useState({});
  const [renewability, setRenewability] = useState({});

  useEffect(() => {
    setUncalculatedScenario(true);
  }, [neighbourhood1, neighbourhood2, heatholon, windholon]);

  useEffect(() => {
    initialCalculationResults
      ? convertCalculationResultsToState(initialCalculationResults)
      : triggercalculate();
  }, [initialCalculationResults]);

  function convertCalculationResultsToState(calculationResults) {
    setReliability(calculationResults.reliability);
    setSelfconsumption(calculationResults.selfconsumption);
    setAffordability(calculationResults.affordability);
    setRenewability(calculationResults.renewability);
  }

  function updateLocal(arg1, arg2) {
    if (arg1 == "local") {
      setLocal(arg2);
    }
  }
  const submitForm = (e) => {
    e.preventDefault();
    triggercalculate();
  };

  async function triggercalculate() {
    setLoading(true);

    //object with data to push to the api
    const data = {
      neighbourhood1: {
        evadoptation: neighbourhood1
          ? neighbourhood1.evadoptation.value
          : neighbourhood1.evadoptation.value,
        solarpanels: neighbourhood1
          ? neighbourhood1.solarpanels.value
          : neighbourhood1.solarpanels.value,
        heatpumps: neighbourhood1 ? neighbourhood1.heatpump.value : neighbourhood1.heatpump.value,
      },
      neighbourhood2: {
        evadoptation: neighbourhood2
          ? neighbourhood2.evadoptation.value
          : neighbourhood2.evadoptation.value,
        solarpanels: neighbourhood2
          ? neighbourhood2.solarpanels.value
          : neighbourhood2.solarpanels.value,
      },
      heatholon: heatholon,
      windholon: windholon,
    };
    console.log(data);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/calculation/`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        //update values with response data, something like this
        convertCalculationResultsToState(data);
        setLoading(false);
        setUncalculatedScenario(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <React.Fragment>
      {locked && (
        <div className="absolute h-full w-full">
          <div className={` absolute mx-10 flex h-[50vh] px-24  ${right ? "right-[0]" : ""} `}>
            <div
              className={`border-solid  ${borderColor} ${right ? "border-r-8" : "border-l-8"} `}
            ></div>
          </div>
        </div>
      )}
      <div className="z-10 mx-auto px-24">
        <div
          className={
            locked
              ? `${borderColor} border-[0.75rem] border-solid bg-white p-2`
              : "border-8 border-transparent p-2"
          }
        >
          <h2 className="mb-6 ml-6 text-5xl font-semibold text-holon-blue-900">{scenarioTitle}</h2>
          <form onSubmit={submitForm} className="flex flex-col md:flex-row">
            <div className="basis-full pr-4 md:basis-1/3">
              <h3
                className={`${borderColor} mb-4 border-l-[0.75rem] pl-3 text-2xl font-medium italic`}
              >
                uitgangspunten
              </h3>
              <fieldset
                data-testid="scenariofieldset"
                disabled={locked || loading}
                className={locked && `cursor-pointer`}
              >
                <div className={locked && ``}>
                  {neighbourhood1 && (
                    <Neighbourhood
                      neighbourhoodID="A"
                      locked={locked}
                      neighbourhood={neighbourhood1}
                      setNeighbourhood={setNeighbourhood1}
                      scenarioid={scenarioid}
                    />
                  )}
                  {neighbourhood2 && (
                    <Neighbourhood
                      neighbourhoodID="B"
                      locked={locked}
                      neighbourhood={neighbourhood2}
                      setNeighbourhood={setNeighbourhood2}
                      scenarioid={scenarioid}
                    />
                  )}
                  <h4 className="my-4 border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-lg font-light">
                    Holonen
                  </h4>

                  <div className="ml-20 mb-4 flex flex-col gap-4">
                    <label
                      htmlFor={`heatholon${scenarioid}`}
                      className="flex flex-row items-center gap-4"
                    >
                      <input
                        type="checkbox"
                        name="heatholon"
                        id={`heatholon${scenarioid}`}
                        data-testid={`heatholon${scenarioid}`}
                        onChange={(e) => setHeatholon(e.target.checked)}
                        checked={heatholon}
                        className="flex h-5 w-5 appearance-none items-center justify-center rounded-none border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white shadow-[4px_4px_0_0] shadow-black checked:bg-holon-blue-500 after:checked:content-['✔'] disabled:border-holon-grey-300 disabled:shadow-gray-500 disabled:checked:bg-holon-grey-300"
                      />
                      <span className="mr-auto">Warmteholon</span>
                      <Tooltip tooltipMessage=" De warmteholon is de coöperatie van   buurtbewoners die aangesloten zijn op het warmtenet. Zij worden eigenaar van   het warmtenet en regelen de centrale aansturing. Deze aansturing zorgt ervoor   dat de overschotten zonne-energie van de holon leden gebruikt worden om de   warmtepomp aan te zetten en buffer te vullen, en in combinatie met de   windholon ook die overschotten te gebruiken."></Tooltip>
                    </label>
                    <label
                      htmlFor={`windholon${scenarioid}`}
                      className="flex flex-row items-center gap-4"
                    >
                      <input
                        type="checkbox"
                        name="windholon"
                        id={`windholon${scenarioid}`}
                        data-testid={`windholon${scenarioid}`}
                        onChange={(e) => setWindholon(e.target.checked)}
                        checked={windholon}
                        className="flex h-5 w-5 appearance-none items-center justify-center rounded-none border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white shadow-[4px_4px_0_0] shadow-black checked:bg-holon-blue-500 after:checked:content-['✔'] disabled:border-holon-grey-300 disabled:shadow-gray-500 disabled:checked:bg-holon-grey-300"
                      />
                      <span className="mr-auto">Windholon</span>
                      <Tooltip tooltipMessage="De windholon is de coöperatie van buurtbewoners   die samen gaat investeren in een windturbine. Om deze te mogen bouwen in een   gebied met transportschaarste moeten de leden hun verbruik afstemmen op de   opwek van de windturbine. Hiermee ontlasten ze het HS/MS-station waar de   windturbine op aangesloten is."></Tooltip>
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="w-[4px] bg-slate-300"></div>
            <div className="basis-full pl-4 md:basis-2/3">
              <ScenarioResults
                scenarioid={scenarioid}
                reliability={reliability}
                selfconsumption={selfconsumption}
                affordability={affordability}
                renewability={renewability}
                local={local}
                heatholon={heatholon}
                windholon={windholon}
                setLocal={updateLocal}
                borderColor={borderColor}
              >
                {locked && loading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                    <Loader />
                  </div>
                )}
                {!locked && (
                  <React.Fragment>
                    {(uncalculatedScenario == true || loading) && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                        {loading ? (
                          <ProgressBar label="Berekenen..." duration={45} />
                        ) : (
                          <HolonButton type="submit" variant="darkblue">
                            Herbereken
                          </HolonButton>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                )}
              </ScenarioResults>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Scenarios;

Scenarios.propTypes = {
  scenarioid: PropTypes.string,
  locked: PropTypes.bool,
  scenarioTitle: PropTypes.string,
  borderColor: PropTypes.string,

  neighbourhood1: PropTypes.shape({
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
  neighbourhood2: PropTypes.shape({
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
  calculationresults: PropTypes.shape({
    reliability: PropTypes.shape({
      local: PropTypes.number,
      national: PropTypes.number,
    }),
    affordability: PropTypes.shape({
      local: PropTypes.number,
      national: PropTypes.number,
    }),
    renewability: PropTypes.shape({
      local: PropTypes.number,
      national: PropTypes.number,
    }),
    selfconsumption: PropTypes.shape({
      local: PropTypes.number,
      national: PropTypes.number,
    }),
  }),
  windholon: PropTypes.bool,
  heatholon: PropTypes.bool,
  right: PropTypes.string,
};
