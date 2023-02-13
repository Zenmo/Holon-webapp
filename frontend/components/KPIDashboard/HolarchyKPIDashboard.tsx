import KPIItem from "./KPIItem";
import React from "react";
import styles from "./KPIItem.module.css";

type KPIDashboardProps = {
  data: Data;
  loading: boolean;
  textLabelNational: string;
  textLabelIntermediate: string;
  textLabelLocal: string;
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

export default function HolarchyKPIDashboard({
  data,
  loading,
  textLabelNational,
  textLabelIntermediate,
  textLabelLocal,
}: KPIDashboardProps) {
  const levels = [
    {
      title: "National",
      bgcolor: "bg-holon-blue-100",
      dataobject: "national",
      labelNode: "textLabelNational",
    },
    // {
    //   title: "Res",
    //   bgcolor: "bg-holon-blue-200",
    //   dataobject: "intermediate",
    //   labelNode: "textLabelIntermediate"
    // },
    {
      title: "Lokale KPIs",
      bgcolor: "bg-holon-blue-500",
      dataobject: "local",
      labelNode: "textLabelLocal",
    },
  ];

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
  console.log(Object(textLabelIntermediate));

  return (
    <div className="" data-testid="KPIDashboard">
      {levels.map((level, index) => (
        <div
          key={index}
          className={`flex flex-row flex-wrap  ${loading ? "bg-holon-gray-300" : level.bgcolor}`}>
          <p className={styles["kpiHolarchy__title"]}>
            {level.dataobject == "national"
              ? textLabelNational
              : level.dataobject == "local"
              ? textLabelLocal
              : level.dataobject == "intermediate"
              ? textLabelIntermediate
              : ""}
          </p>
          <KPIItem
            view="kpiHolarchy"
            title="Netbelasting"
            label="netload"
            value={valueCheck(data[level.dataobject].netload)}
            unit="%"
          />
          <KPIItem
            view="kpiHolarchy"
            title="Betaalbaarheid"
            label="costs"
            unit={level.dataobject === "local" ? "k.EUR/jaar" : "mld.EUR/jaar"}
            value={valueCosts(level.dataobject)}></KPIItem>
          <KPIItem
            view="kpiHolarchy"
            title="Duurzaamheid"
            label="sustainability"
            value={valueCheck(data[level.dataobject].sustainability)}
            unit="%"
          />
          <KPIItem
            view="kpiHolarchy"
            title="Zelfvoorzienendheid"
            label="selfSufficiency"
            value={valueCheck(data[level.dataobject].selfSufficiency)}
            unit="%"></KPIItem>
        </div>
      ))}
    </div>
  );
}
