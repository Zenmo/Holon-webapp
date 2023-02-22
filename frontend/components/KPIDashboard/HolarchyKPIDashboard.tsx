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
      css: "row-start-7 bg-holon-blue-100 md:row-start-1 md:col-start-3",
    },
    // {
    //   title: "Res",
    //   bgcolor: "bg-holon-blue-200",
    //   dataobject: "intermediate",
    //   labelNode: "textLabelIntermediate",
    //   css: "row-start-8 bg-holon-blue-200 md:row-start-2 md:col-start-3",
    // },
    {
      title: "Lokale KPIs",
      bgcolor: "bg-holon-blue-500",
      dataobject: "local",
      labelNode: "textLabelLocal",
      css: "row-start-9 bg-holon-blue-300 md:row-start-3 md:col-start-3",
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

  return (
    <React.Fragment>
      {levels.map((level, index) => (
        <div
          key={index}
          className={`${level.css} row-span-1 col-start-1 col-span-1 md:col-span-1 overflow-auto md:row-span-1 border-b-2 border-dashed border-holon-blue-900`}
          data-testid="KPIDashboard">
          <div key={index} className={`flex flex-row flex-wrap p-2`}>
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
        </div>
      ))}
    </React.Fragment>
  );
}
