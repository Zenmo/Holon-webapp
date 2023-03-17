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

  const backgroundColor = loading ? "bg-holon-gray-300" : "bg-holon-slated-blue-900";

  return (
    <div className="flex flex-col w-full " data-testid="KPIDashboard">
      <div className="flex flex-row justify-around items-center">
        <KPIRadioButtons updateValue={setLevel} loading={loading} dashboardId={dashboardId} />
        <Button onClick={handleClickCostBen}>Kosten en Baten</Button>
      </div>
      <div className={`flex flex-row ${backgroundColor}`}>
        <KPIItems view="kpiStoryline" data={data} level={level} loading={loading} />
      </div>
    </div>
  );
}
