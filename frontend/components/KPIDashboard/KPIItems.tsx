import React from "react";
import KPIItem from "./KPIItem";
import { KPIData } from "./types";
import styles from "./KPIItem.module.css";

type KPIItems = {
  view: string;
  data: KPIData;
  level: string;
  loading: boolean;
};

export default function KPIItems({ view, data, level, loading }: KPIItems) {
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
      {data[level] ? (
        <React.Fragment>
          <KPIItem
            view={view}
            title="Netbelasting"
            label="netload"
            value={valueCheck(data[level].netload)}
            unit="%"
          />
          <KPIItem
            view={view}
            title="Betaalbaarheid"
            label="costs"
            unit={level === "local" ? "k.EUR/jaar" : "mld.EUR/jaar"}
            value={valueCosts(level)}></KPIItem>
          <KPIItem
            view={view}
            title="Duurzaamheid"
            label="sustainability"
            value={valueCheck(data[level].sustainability)}
            unit="%"
          />
          <KPIItem
            view={view}
            title="Zelfvoorzienendheid"
            label="selfSufficiency"
            value={valueCheck(data[level].selfSufficiency)}
            unit="%"></KPIItem>
        </React.Fragment>
      ) : (
        <span className={styles["kpiHolarchy__nodata"]}>Er is geen data op dit niveau.</span>
      )}
    </React.Fragment>
  );
}
