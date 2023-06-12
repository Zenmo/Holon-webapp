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
};

export default function KPIDashboard({
  data,
  loading,
  dashboardId,
  handleClickCostBen,
}: KPIDashboardProps) {
  const [level, setLevel] = useState("local");

  const backgroundColor = loading ? "bg-holon-gray-400" : "bg-holon-slated-blue-900";

  return (
    <div className="flex flex-col w-full " data-testid="KPIDashboard">
      <div className="flex flex-row justify-around items-center">
        <KPIRadioButtons updateValue={setLevel} loading={loading} dashboardId={dashboardId} />
        <Button onClick={handleClickCostBen}>Kosten en Baten</Button>
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
