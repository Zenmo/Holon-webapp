import { useState } from "react";
import KPIItem from "./KPIItem";
import KPIRadioButtons from "./KPIRadiobuttons";
type KPIDashboardProps = {
  data: Data;
  loading: boolean;
};

type Data = {
  local: {
    netload: number;
    costs: number;
    sustainability: number;
    self_sufficiency: number;
  };
  national: {
    netload: number;
    costs: number;
    sustainability: number;
    self_sufficiency: number;
  };
};

export default function KPIDashboard({ data, loading }: KPIDashboardProps) {
  const [level, setLevel] = useState("local");

  const backgroundColor = loading ? "bg-holon-gray-300" : "bg-holon-slated-blue-900";

  function valueCheck(value: number): number | string {
    if (value == undefined || loading) {
      return "-";
    } else {
      return value;
    }
  }

  function CostKPIItemGenerator(level: string) {
    let value = valueCheck(data[level].costs);
    if (level == "local") {
      // divides by 1e9 because "miljard"
      typeof value == "number" ? (value = value / 1e9) : (value = value);
      return <KPIItem label="Betaalbaarheid" value={value} unit="mld.EUR/jaar"></KPIItem>;
    } else {
      // divides by 1e3 because "k euro"
      typeof value == "number" ? (value = value / 1e3) : (value = value);
      return <KPIItem label="Betaalbaarheid" value={value} unit="kEUR/jaar"></KPIItem>;
    }
  }

  return (
    <div className="flex flex-col w-full " data-testid="KPIDashboard">
      <div>
        <KPIRadioButtons updateValue={setLevel} loading={loading} />
      </div>
      <div className={`flex flex-row ${backgroundColor}`}>
        <KPIItem label="Netbelasting" value={valueCheck(data[level].netload)} unit="%" />
        {CostKPIItemGenerator(level)}
        <KPIItem label="Duurzaamheid" value={valueCheck(data[level].sustainability)} unit="%" />
        <KPIItem
          label="Zelfvoorzienendheid"
          value={valueCheck(data[level].self_sufficiency)}
          unit="%"></KPIItem>
      </div>
    </div>
  );
}
