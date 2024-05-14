import React from "react";
import KPIItems from "./KPIItems";
import styles from "./KPIItem.module.css";
import {KPIsByScale} from "@/api/holon";
import {initialKPIsByScale} from "@/services/use-simulation";

type KPIDashboardProps = {
  data: KPIsByScale;
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
      dataobject: "national",
      labelNode: "textLabelNational",
      css: "row-start-7 bg-holon-holarchy-national md:row-start-1 md:col-start-3",
    },
    {
      title: "Res",
      dataobject: "intermediate",
      labelNode: "textLabelIntermediate",
      css: "row-start-8 bg-holon-holarchy-intermediate md:row-start-2 md:col-start-3",
    },
    {
      title: "Lokale KPIs",
      dataobject: "local",
      labelNode: "textLabelLocal",
      css: "row-start-9 bg-holon-holarchy-local md:row-start-3 md:col-start-3",
    },
  ];

  return (
    <React.Fragment>
      {levels.map((level, index) => (
        <div
          key={index}
          className={`${level.css} row-span-1 col-start-1 col-span-1 md:col-span-1 overflow-auto md:row-span-1`}
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
            <KPIItems view="kpiHolarchy" previousData={initialKPIsByScale} data={data} level={level.dataobject} loading={loading} />
          </div>
        </div>
      ))}
    </React.Fragment>
  );
}
