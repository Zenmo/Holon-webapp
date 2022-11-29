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
    selfSufficiency: number;
  };
  national: {
    netload: number;
    costs: number;
    sustainability: number;
    selfSufficiency: number;
  };
};

export default function KPIDashboard({ data, loading }: KPIDashboardProps) {
  const [level, setLevel] = useState("local");

  const backgroundColor = loading ? "bg-holon-gray-300" : "bg-holon-slated-blue-900";

  function valueCheck(value: number) {
    if (value == undefined || loading) {
      return "-";
    } else {
      return value;
    }
  }

  return (
    <div className="flex flex-col w-full " data-testid="KPIDashboard">
      <div>
        <KPIRadioButtons updateValue={setLevel} loading={loading} />
      </div>
      <div className={`flex flex-row ${backgroundColor}`}>
        <KPIItem label="Netbelasting" value={valueCheck(data[level].netload)} unit="%" />
        <KPIItem
          label="Betaalbaarheid"
          value={valueCheck(data[level].costs)}
          unit="kEUR/jaar"></KPIItem>
        <KPIItem label="Duurzaamheid" value={valueCheck(data[level].sustainability)} unit="%" />
        <KPIItem
          label="Zelfvoorzienendheid"
          value={valueCheck(data[level].selfSufficiency)}
          unit="%"></KPIItem>
      </div>
    </div>
  );
}
