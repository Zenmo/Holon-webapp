import { Cog8ToothIcon, CurrencyEuroIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "../Button/Button";
import KPIItems from "./KPIItems";
import KPIRadioButtons from "./KPIRadiobuttons";
import { KPIData } from "./types";
import {LoadingState, SimulationState} from "@/services/use-simulation";

type KPIDashboardProps = {
  simulationState: SimulationState;
  data: KPIData;
  loading: boolean;
  loadingState: LoadingState;
  dashboardId: string;
  handleClickCostBen: () => void;
  handleClickScenario: () => void;
};

export default function KPIDashboard({
  simulationState,
  data,
  loading,
  loadingState,
  dashboardId,
  handleClickCostBen,
  handleClickScenario,
}: KPIDashboardProps) {
  const [level, setLevel] = useState("local");

  const backgroundColor = loading ? "bg-holon-gray-400" : "bg-holon-slated-blue-900";

  return (
    <div className="flex flex-col w-full " data-testid="KPIDashboard">
      <div className="flex flex-row justify-around items-center">
        <KPIRadioButtons updateValue={setLevel} loading={loading} dashboardId={dashboardId} />
        <Button onClick={handleClickCostBen} variant="light" disabled={loading}>
          <CurrencyEuroIcon className="h-5 w-5 pr-1" />
          Kosten en Baten
        </Button>
        <Button onClick={handleClickScenario} variant="light" disabled={loading}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/imgs/save.png" alt="icon save" width={20} height={20} className="mr-2" />
          Scenario delen
        </Button>
      </div>
      <div className={`flex flex-row ${backgroundColor}`}>
        {["INITIAL", "DONE", "DIRTY"].includes(loadingState) ? (
          <KPIItems view="kpiStoryline" data={data} level={level} loading={loading} />
        ) : (
          <div className="flex flex-row justify-around items-center text-white min-h-[170px] w-full">
            <div className="font-bold text-lg">
              {loadingState === "SENT" && <Cog8ToothIcon className="animate-spin h-8 w-8" style={{animationDuration: '3s'}}/>}
              {loadingState === "SIMULATING" && (
                  <>
                    <Cog8ToothIcon className="animate-spin h-8 w-8" style={{animationDuration: '3s', display: 'inline' }} />
                    &nbsp;&nbsp;
                    Het scenario wordt doorgerekend. Dit duurt even.
                  </>
                )
              }
              {loadingState === "ERROR" && (
                  <>
                    <div>Er is een fout opgetreden.</div>
                    <div style={{fontSize: '.7rem'}}>Details: ${simulationState.error?.message}</div>
                  </>
                )
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
