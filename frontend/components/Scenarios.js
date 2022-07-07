import React, { useState, useEffect } from "react";
import Scenarioresults from "./Scenarios/Scenariosresults";
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
  const [sustainable, setSustainable] = useState(0);
  const [affordability, setAffordability] = useState(0);
  const [selfsufficient, setSelfsufficient] = useState(0);

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
          setSustainable({
            national: props.calculationresults.national.sustainable,
            local: props.calculationresults.local.sustainable,
          }),
          setAffordability({
            national: props.calculationresults.national.affordability,
            local: props.calculationresults.local.affordability,
          }),
          setSelfsufficient({
            national: props.calculationresults.national.selfsufficient,
            local: props.calculationresults.local.selfsufficient,
          }))
        : (setReliability({
            national: Math.floor(Math.random() * 100),
            local: Math.floor(Math.random() * 100),
          }),
          setSustainable({
            national: Math.floor(Math.random() * 10000),
            local: Math.floor(Math.random() * 10000),
          }),
          setAffordability({
            national: Math.floor(Math.random() * 10000),
            local: Math.floor(Math.random() * 10000),
          }),
          setSelfsufficient({
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
              ? `${props.borderColor} border-8 border-solid bg-white p-2`
              : "border-8 border-transparent p-2"
          }
        >
          <h2 className="text-2xl">Twee keer slimmer</h2>
          <div className="flex flex-col md:flex-row">
            <div className="basis-full pr-4 md:basis-1/3">
              <form className="">
                <h3 className="mb-4 text-xl">Instellingen</h3>
                <fieldset
                  disabled={props.locked || loading}
                  className={props.locked && `cursor-not-allowed`}
                >
                  <div>
                    {neighbourhood1 && (
                      <Neighbourhood
                        scenarioid={props.scenarioid}
                        label="1"
                        locked={props.locked}
                        neighbourhood={neighbourhood1}
                        setNeighbourhood={setNeighbourhood1}
                      />
                    )}
                    {neighbourhood2 && (
                      <Neighbourhood
                        scenarioid={props.scenarioid}
                        label="2"
                        locked={props.locked}
                        neighbourhood={neighbourhood2}
                        setNeighbourhood={setNeighbourhood2}
                      />
                    )}
                    <h5 className="text-lg">Juridisch</h5>

                    <div className="flex flex-col">
                      <label
                        htmlFor={`heatholon${props.scenarioid}`}
                        className="mb-2 flex flex-row items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          name="heatholon"
                          id={`heatholon${props.scenarioid}`}
                          onChange={(e) => setHeatholon(e.target.checked)}
                          checked={heatholon}
                        />
                        <span className="mr-auto">Warmteholon</span>
                        <Tooltip tooltipMessage=" De warmteholon is de coöperatie van   buurtbewoners die aangesloten zijn op het warmtenet. Zij worden eigenaar van   het warmtenet en regelen de centrale aansturing. Deze aansturing zorgt ervoor   dat de overschotten zonne-energie van de holon leden gebruikt worden om de   warmtepomp aan te zetten en buffer te vullen, en in combinatie met de   windholon ook die overschotten te gebruiken.">
                          <span className="block h-[1rem] w-[1rem] rounded-full border bg-green-300 text-center leading-[1rem]">
                            i
                          </span>
                        </Tooltip>
                      </label>
                      <label
                        htmlFor={`windholon${props.scenarioid}`}
                        className="mb-2 flex flex-row items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          name="windholon"
                          id={`windholon${props.scenarioid}`}
                          onChange={(e) => setWindholon(e.target.checked)}
                          checked={windholon}
                        />
                        <span className="mr-auto">Windholon</span>
                        <Tooltip tooltipMessage="De windholon is de coöperatie van buurtbewoners   die samen gaat investeren in een windturbine. Om deze te mogen bouwen in een   gebied met transportschaarste moeten de leden hun verbruik afstemmen op de   opwek van de windturbine. Hiermee ontlasten ze het HS/MS-station waar de   windturbine op aangesloten is.">
                          <span className="block h-[1rem] w-[1rem] rounded-full border bg-green-300 text-center leading-[1rem]">
                            i
                          </span>
                        </Tooltip>
                      </label>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
            <div className="w-[4px] bg-slate-300"></div>
            <div className="basis-full pl-4 md:basis-2/3">
              <Scenarioresults
                scenarioid={props.scenarioid}
                reliability={reliability}
                sustainable={sustainable}
                affordability={affordability}
                selfsufficient={selfsufficient}
                local={local}
                heatholon={heatholon}
                windholon={windholon}
                setLocal={updateLocal}
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
              </Scenarioresults>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Scenarios;
