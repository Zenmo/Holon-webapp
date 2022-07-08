import React, { useState, useEffect } from "react";
import ScenarioResults from "./Scenarios/ScenariosResults";
import HolonButton from "../components/Buttons/HolonButton";
import Loader from "./Scenarios/Loader";
import Neighbourhood from "./Scenarios/Neighbourhood";
import Tooltip from "./Scenarios/Tooltip";

function Scenarios(props) {
  const [loading, setLoading] = useState(false);

  const [uncalculatedScenario, setUncalculatedScenario] = useState(false);

  const [neighbourhood1, setNeighbourhood1] = useState();
  const [neighbourhood2, setNeighbourhood2] = useState();

  const [heatholon, setHeatholon] = useState(false);
  const [windholon, setWindholon] = useState(false);

  const [local, setLocal] = useState(true);

  const [reliability, setReliability] = useState(0);
  const [selfconsumption, setSelfconsumption] = useState(0);
  const [affordability, setAffordability] = useState(0);
  const [renewability, setRenewability] = useState(0);

  useEffect(() => {
    setUncalculatedScenario(true);
  }, [neighbourhood1, neighbourhood2, heatholon, windholon]);

  useEffect(() => {
    props.neighbourhood1 && setNeighbourhood1(props.neighbourhood1);
    props.neighbourhood2 && setNeighbourhood2(props.neighbourhood2);

    props.heatholon && setHeatholon(props.heatholon);
    props.windholon && setWindholon(props.windholon);

    // start calculating when all ingredients are there to calculate
    props.neighbourhood1 && props.neighbourhood2 && triggercalculate();
  }, []);

  async function triggercalculate(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
      setUncalculatedScenario(false);

      props.calculationresults
        ? (setReliability({
            national: props.calculationresults.national.reliability,
            local: props.calculationresults.local.reliability,
          }),
          setSelfconsumption({
            national: props.calculationresults.national.selfconsumption,
            local: props.calculationresults.local.selfconsumption,
          }),
          setAffordability({
            national: props.calculationresults.national.affordability,
            local: props.calculationresults.local.affordability,
          }),
          setRenewability({
            national: props.calculationresults.national.renewability,
            local: props.calculationresults.local.renewability,
          }))
        : (setReliability({
            national: Math.floor(Math.random() * 100),
            local: Math.floor(Math.random() * 100),
          }),
          setSelfconsumption({
            national: Math.floor(Math.random() * 10000),
            local: Math.floor(Math.random() * 10000),
          }),
          setAffordability({
            national: Math.floor(Math.random() * 10000),
            local: Math.floor(Math.random() * 10000),
          }),
          setRenewability({
            national: Math.floor(Math.random() * 100),
            local: Math.floor(Math.random() * 100),
          }));
    }, 2000);

    return () => clearTimeout(timer);
  }

  function updateLocal(arg1, arg2) {
    if (arg1 == "local") {
      setLocal(arg2);
    }
  }
  return (
    <React.Fragment>
      {props.locked && (
        <div className="absolute h-full w-full">
          <div
            className={` absolute mx-10 flex h-[50vh] px-24  ${props.right ? "right-[0]" : ""} `}
          >
            <div
              className={`border-solid  ${props.borderColor} ${
                props.right ? "border-r-8" : "border-l-8"
              } `}
            ></div>
          </div>
        </div>
      )}
      <div className="z-10 mx-auto px-24">
        <div
          className={
            props.locked
              ? `${props.borderColor} border-[0.75rem] border-solid bg-white p-2`
              : "border-8 border-transparent p-2"
          }
        >
          <h2 className="mb-6 ml-6 text-5xl font-semibold text-holon-blue-900">
            {props.scenarioTitle}
          </h2>
          <div className="flex flex-col md:flex-row">
            <div className="basis-full pr-4 md:basis-1/3">
              <form className="">
                <h3
                  className={`${props.borderColor} mb-4 border-l-[0.75rem] pl-3 text-2xl font-medium italic`}
                >
                  uitgangspunten
                </h3>
                <fieldset
                  disabled={props.locked || loading}
                  className={props.locked && `cursor-pointer`}
                >
                  <div className={props.locked && ``}>
                    {neighbourhood1 && (
                      <Neighbourhood
                        neighbourhoodID="A"
                        locked={props.locked}
                        neighbourhood={neighbourhood1}
                        setNeighbourhood={setNeighbourhood1}
                        scenarioid={props.scenarioid}
                      />
                    )}
                    {neighbourhood2 && (
                      <Neighbourhood
                        neighbourhoodID="B"
                        locked={props.locked}
                        neighbourhood={neighbourhood2}
                        setNeighbourhood={setNeighbourhood2}
                        scenarioid={props.scenarioid}
                      />
                    )}
                    <h4 className="my-4 border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-lg font-light">
                      Holonen
                    </h4>

                    <div className="ml-6 flex flex-col gap-4">
                      <label
                        htmlFor={`heatholon${props.scenarioid}`}
                        className="flex flex-row items-center gap-4"
                      >
                        <input
                          type="checkbox"
                          name="heatholon"
                          id={`heatholon${props.scenarioid}`}
                          onChange={(e) => setHeatholon(e.target.checked)}
                          checked={heatholon}
                          className="h-5 w-5 appearance-none rounded-none border-2 border-holon-blue-900 from-inherit bg-contain bg-center shadow-[4px_4px_0_0] checked:bg-holon-blue-500"
                        />
                        <span className="mr-auto">Warmteholon</span>
                        <Tooltip tooltipMessage=" De warmteholon is de coöperatie van   buurtbewoners die aangesloten zijn op het warmtenet. Zij worden eigenaar van   het warmtenet en regelen de centrale aansturing. Deze aansturing zorgt ervoor   dat de overschotten zonne-energie van de holon leden gebruikt worden om de   warmtepomp aan te zetten en buffer te vullen, en in combinatie met de   windholon ook die overschotten te gebruiken."></Tooltip>
                      </label>
                      <label
                        htmlFor={`windholon${props.scenarioid}`}
                        className="flex flex-row items-center gap-4"
                      >
                        <input
                          type="checkbox"
                          name="windholon"
                          id={`windholon${props.scenarioid}`}
                          onChange={(e) => setWindholon(e.target.checked)}
                          checked={windholon}
                          className="h-5 w-5 appearance-none rounded-none border-2 border-holon-blue-900 from-inherit bg-contain bg-center shadow-[4px_4px_0_0] checked:bg-holon-blue-500"
                        />
                        <span className="mr-auto">Windholon</span>
                        <Tooltip tooltipMessage="De windholon is de coöperatie van buurtbewoners   die samen gaat investeren in een windturbine. Om deze te mogen bouwen in een   gebied met transportschaarste moeten de leden hun verbruik afstemmen op de   opwek van de windturbine. Hiermee ontlasten ze het HS/MS-station waar de   windturbine op aangesloten is."></Tooltip>
                      </label>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
            <div className="w-[4px] bg-slate-300"></div>
            <div className="basis-full pl-4 md:basis-2/3">
              <ScenarioResults
                scenarioid={props.scenarioid}
                reliability={reliability}
                selfconsumption={selfconsumption}
                affordability={affordability}
                renewability={renewability}
                local={local}
                heatholon={heatholon}
                windholon={windholon}
                setLocal={updateLocal}
                borderColor={props.borderColor}
              >
                {props.locked && loading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                    <Loader />
                  </div>
                )}
                {!props.locked && (
                  <React.Fragment>
                    {(uncalculatedScenario == true || loading) && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                        {loading ? (
                          <Loader />
                        ) : (
                          <HolonButton variant="darkblue" onClick={(e) => triggercalculate(e)}>
                            Herbereken
                          </HolonButton>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                )}
              </ScenarioResults>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Scenarios;
