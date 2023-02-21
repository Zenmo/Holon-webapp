import { useState } from "react";
import KPIItem from "./KPIItem";
import KPIRadioButtons from "./KPIRadiobuttons";
import { KPIData } from "./types";

type KPIDashboardProps = {
  data: KPIData;
  loading: boolean;
  dashboardId: string;
};

export default function KPIDashboard({ data, loading, dashboardId }: KPIDashboardProps) {
  const [level, setLevel] = useState("local");

  const backgroundColor = loading ? "bg-holon-gray-300" : "bg-holon-slated-blue-900";

  function valueCheck(value: number): number | string {
    if (value == undefined || loading) {
      return "-";
    } else {
      return value;
    }
  }

  function valueCosts(level: string) {
    let value = valueCheck(data[level].costs);
    if (level == "local") {
      // divides by 1e3 because "k euro"
      typeof value == "number" ? (value = value / 1e3) : (value = value);
    } else {
      // divides by 1e9 because "mld euro"
      typeof value == "number" ? (value = value / 1e9) : (value = value);
    }
    return value;
  }

  return (
    <div className="flex flex-col w-full " data-testid="KPIDashboard">
      <div>
        <KPIRadioButtons updateValue={setLevel} loading={loading} dashboardId={dashboardId} />
      </div>
      <div className={`flex flex-row ${backgroundColor}`}>
        <KPIItem
          view="kpiStoryline"
          title="Netbelasting"
          label="netload"
          value={valueCheck(data[level].netload)}
          unit="%"
        />
        <KPIItem
          view="kpiStoryline"
          title="Betaalbaarheid"
          label="costs"
          unit={level === "local" ? "k.EUR/jaar" : "mld.EUR/jaar"}
          value={valueCosts(level)}></KPIItem>
        <KPIItem
          view="kpiStoryline"
          title="Duurzaamheid"
          label="sustainability"
          value={valueCheck(data[level].sustainability)}
          unit="%"
        />
        <KPIItem
          view="kpiStoryline"
          title="Zelfvoorzienendheid"
          label="selfSufficiency"
          value={valueCheck(data[level].selfSufficiency)}
          unit="%"></KPIItem>
      </div>
    </div>
  );
}
