import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import KPIItems from "./KPIItems";
import KPIRadioButtons from "./KPIRadiobuttons";
import {LoadingState, SimulationState} from "@/services/use-simulation";
import {KPIsByScale} from "@/api/holon";
import {CostBenefitButton} from "@/components/KPIDashboard/CostBenefitButton"
import {HolarchyButton} from "@/components/KPIDashboard/HolarchyButton"

type KPIDashboardProps = {
  simulationState: SimulationState;
  data: KPIsByScale;
  loading: boolean;
  loadingState: LoadingState;
  dashboardId: string;
  handleClickCostBen: () => void;
  handleClickHolarchy: () => void;
};

export const KPIBackgroundColorClass = "bg-holon-slated-blue-900"

export default function KPIDashboard({
  simulationState,
  data,
  loading,
  loadingState,
  dashboardId,
  handleClickCostBen,
  handleClickHolarchy,
}: KPIDashboardProps) {
  const [level, setLevel] = useState("local");

  const backgroundColor = loading ? "bg-holon-gray-400" : KPIBackgroundColorClass;

  return (
    <div className="flex flex-col w-full " data-testid="KPIDashboard">
      <div className="flex flex-row justify-between items-center" style={{
        margin: ".5rem 0 .5rem 1.5rem"
      }}>
        <KPIRadioButtons updateValue={setLevel} loading={loading} dashboardId={dashboardId}/>
        <div className="flex flex-col items-stretch">
          <CostBenefitButton onClick={handleClickCostBen} disabled={loading} style={{height: "3rem"}} />
          <HolarchyButton onClick={handleClickHolarchy} disabled={loading} style={{height: "3rem"}} />
        </div>
      </div>
      <div className={`flex flex-row ${backgroundColor}`}>
        {["INITIAL", "DONE", "DIRTY"].includes(loadingState) ? (
          <KPIItems view="kpiStoryline" previousData={simulationState.previousResult.dashboardResults} data={data} level={level} loading={loading} />
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
