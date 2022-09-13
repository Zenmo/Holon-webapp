import { useCallback, useState, useEffect } from "react";
import ScenarioResults from "./ScenarioResults";
import HolonButton from "../Buttons/HolonButton";
import Loader from "./Loader";
import Neighbourhood from "./Neighbourhood";
import Tooltip from "./Tooltip";
import ProgressBar from "./ProgressBar";

import {
  CalculationResponseData,
  Neighbourhood as NeighbourhoodData,
  SubjectResult,
} from "./types";

type CalculationResults = {
  reliability: SubjectResult;
  affordability: SubjectResult;
  renewability: SubjectResult;
  selfconsumption: SubjectResult;
};

type Props = {
  borderColor?: string;
  calculationResults: CalculationResults;
  heatholon?: boolean;
  locked?: boolean;
  neighbourhood1: NeighbourhoodData;
  neighbourhood2: NeighbourhoodData;
  right?: boolean;
  scenarioId: string;
  scenarioTitle?: string;
  windholon?: boolean;
};

export default function Scenarios({
  borderColor,
  calculationResults: initialCalculationResults,
  heatholon: initialHeatholon = false,
  locked = false,
  neighbourhood1: initialNeighbourhood1,
  neighbourhood2: initialNeighbourhood2,
  right = false,
  scenarioId,
  scenarioTitle,
  windholon: initialWindholon = false,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [uncalculatedScenario, setUncalculatedScenario] = useState(false);

  const [neighbourhood1, setNeighbourhood1] = useState(initialNeighbourhood1);
  const [neighbourhood2, setNeighbourhood2] = useState(initialNeighbourhood2);

  const [heatholon, setHeatholon] = useState(initialHeatholon);
  const [windholon, setWindholon] = useState(initialWindholon);

  const [local, setLocal] = useState(true);

  const [reliability, setReliability] = useState(initialCalculationResults.reliability);
  const [selfconsumption, setSelfconsumption] = useState(initialCalculationResults.selfconsumption);
  const [affordability, setAffordability] = useState(initialCalculationResults.affordability);
  const [renewability, setRenewability] = useState(initialCalculationResults.renewability);

  const triggerCalculate = useCallback(async () => {
    setLoading(true);

    //object with data to push to the api
    const data = {
      neighbourhood1: {
        evadoptation: neighbourhood1.evadoptation.value,
        solarpanels: neighbourhood1.solarpanels.value,
        heatpumps: neighbourhood1.heatpump.value,
      },
      neighbourhood2: {
        evadoptation: neighbourhood2.evadoptation.value,
        solarpanels: neighbourhood2.solarpanels.value,
      },
      heatholon: heatholon,
      windholon: windholon,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/calculation/`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data),
      });

      //update values with response data, something like this
      convertCalculationResultsToState(convertFormatting(await response.json()));
      setLoading(false);
      setUncalculatedScenario(false);
    } catch (error) {
      console.error(error);
    }
  }, [heatholon, windholon, neighbourhood1, neighbourhood2]);

  useEffect(() => {
    setUncalculatedScenario(true);
  }, [neighbourhood1, neighbourhood2, heatholon, windholon]);

  useEffect(() => {
    initialCalculationResults
      ? convertCalculationResultsToState(initialCalculationResults)
      : triggerCalculate();
  }, [initialCalculationResults, triggerCalculate]);

  function convertCalculationResultsToState(calculationResults: CalculationResults) {
    setReliability(calculationResults.reliability);
    setSelfconsumption(calculationResults.selfconsumption);
    setAffordability(calculationResults.affordability);
    setRenewability(calculationResults.renewability);
  }

  function updateLocal(arg1: string, arg2: boolean) {
    if (arg1 == "local") {
      setLocal(arg2);
    }
  }

  function convertFormatting(data: CalculationResponseData) {
    return {
      reliability: {
        local: parseFloat(data.local.reliability),
        national: parseFloat(data.national.reliability),
      },
      selfconsumption: {
        local: parseFloat(data.local.selfconsumption),
        national: parseFloat(data.national.selfconsumption),
      },
      affordability: {
        local: parseFloat(data.local.affordability),
        national: parseFloat(data.national.affordability),
      },
      renewability: {
        local: parseFloat(data.local.renewability),
        national: parseFloat(data.national.renewability),
      },
    };
  }

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    triggerCalculate();
  }

  return (
    <>
      {locked && (
        <div className="absolute h-full w-full">
          <div className={` absolute mx-10 flex h-[50vh] px-24  ${right ? "right-0" : ""} `}>
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
          {scenarioTitle ? (
            <h2 className="mb-6 mt-3 ml-6 text-5xl font-semibold text-holon-blue-900">
              {scenarioTitle}
            </h2>
          ) : null}
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
                className={locked ? `cursor-pointer` : ""}
              >
                <div>
                  {neighbourhood1 && (
                    <Neighbourhood
                      neighbourhoodID="A"
                      locked={locked}
                      neighbourhood={neighbourhood1}
                      setNeighbourhood={setNeighbourhood1}
                      scenarioId={scenarioId}
                    />
                  )}
                  {neighbourhood2 && (
                    <Neighbourhood
                      neighbourhoodID="B"
                      locked={locked}
                      neighbourhood={neighbourhood2}
                      setNeighbourhood={setNeighbourhood2}
                      scenarioId={scenarioId}
                    />
                  )}
                  <h4 className="my-4 border-l-[0.75rem] border-b-2 border-holon-blue-900 pl-3 text-lg font-light">
                    Holonen
                  </h4>

                  <div className="ml-20 mb-4 flex flex-col gap-4">
                    <label
                      htmlFor={`heatholon${scenarioId}`}
                      className="flex flex-row items-center gap-4"
                    >
                      <input
                        type="checkbox"
                        name="heatholon"
                        id={`heatholon${scenarioId}`}
                        data-testid={`heatholon${scenarioId}`}
                        onChange={(e) => setHeatholon(e.target.checked)}
                        checked={heatholon}
                        className="flex h-5 w-5 appearance-none items-center justify-center rounded-none border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white shadow-[4px_4px_0_0] shadow-black checked:bg-holon-blue-500 after:checked:content-['✔'] disabled:border-holon-grey-300 disabled:shadow-gray-500 disabled:checked:bg-holon-grey-300"
                      />
                      <span className="mr-auto">Warmteholon</span>
                      <Tooltip tooltipMessage=" De warmteholon is de coöperatie van   buurtbewoners die aangesloten zijn op het warmtenet. Zij worden eigenaar van   het warmtenet en regelen de centrale aansturing. Deze aansturing zorgt ervoor   dat de overschotten zonne-energie van de holon leden gebruikt worden om de   warmtepomp aan te zetten en buffer te vullen, en in combinatie met de   windholon ook die overschotten te gebruiken."></Tooltip>
                    </label>
                    <label
                      htmlFor={`windholon${scenarioId}`}
                      className="flex flex-row items-center gap-4"
                    >
                      <input
                        type="checkbox"
                        name="windholon"
                        id={`windholon${scenarioId}`}
                        data-testid={`windholon${scenarioId}`}
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
                scenarioId={scenarioId}
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
                  <>
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
                  </>
                )}
              </ScenarioResults>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
