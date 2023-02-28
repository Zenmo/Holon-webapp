import React from "react";
import KPIItems from "./KPIItems";
import styles from "./KPIItem.module.css";
import { KPIData } from "./types";

type KPIDashboardProps = {
  data: KPIData;
  loading: boolean;
  textLabelNational: string;
  textLabelIntermediate: string;
  textLabelLocal: string;
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
            <KPIItems view="kpiHolarchy" data={data} level={level.dataobject} loading={loading} />
          </div>
        </div>
      ))}
    </React.Fragment>
  );
}
