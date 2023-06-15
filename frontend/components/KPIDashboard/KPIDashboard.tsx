import { CurrencyEuroIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "../Button/Button";
import KPIItems from "./KPIItems";
import KPIRadioButtons from "./KPIRadiobuttons";
import { KPIData } from "./types";

type KPIDashboardProps = {
  data: KPIData;
  loading: boolean;
  dashboardId: string;
  handleClickCostBen: () => void;
  handleClickScenario: () => void;
};

export default function KPIDashboard({
  data,
  loading,
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
        <Button onClick={handleClickCostBen} variant="light">
          <CurrencyEuroIcon className="h-5 w-5 pr-1" />
          Kosten en Baten
        </Button>
        <Button onClick={handleClickScenario} variant="light">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/imgs/save.png" alt="icon save" width={20} height={20} className="mr-2" />
          Scenario opslaan
        </Button>
      </div>
      <div className={`flex flex-row ${backgroundColor}`}>
        {!loading ? (
          <KPIItems view="kpiStoryline" data={data} level={level} loading={loading} />
        ) : (
          <div className="flex flex-row justify-around items-center text-white min-h-[170px] w-full">
            <div className="font-bold text-lg">Instellingen aan het doorrekenen...</div>
          </div>
        )}
      </div>
    </div>
  );
}
