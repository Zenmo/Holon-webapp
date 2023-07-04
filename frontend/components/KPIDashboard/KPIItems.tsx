import React from "react";
import KPIItem from "./KPIItem";
import styles from "./KPIItem.module.css";
import { KPIData } from "./types";

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
    } else if (typeof value == "number") {
      value = Math.round(value * 10) / 10;
      return value;
    } else {
      return value;
    }
  }

  function valueCosts(level: string) {
    let value = data[level].costs;
    if (level == "local") {
      // divides by 1e3 because "k euro"
      typeof value == "number" ? (value = value / 1e3) : (value = value);
    } else {
      // divides by 1e9 because "mld euro"
      typeof value == "number" ? (value = value / 1e9) : (value = value);
    }
    return valueCheck(value);
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
            description="Deze indicator geeft de maximale belasting gedurende het jaar als percentage van het transformatorvermogen weer."
          />
          <KPIItem
            view={view}
            title="Betaalbaarheid"
            label="costs"
            unit={level === "local" ? "k.EUR/jaar" : "mld.EUR/jaar"}
            value={valueCosts(level)}
            description="Op lokaal niveau geeft deze indicator de totale jaarlijkse kosten voor de energievoorziening van het gesimuleerde gebied (EUR/jaar) weer."
          />
          <KPIItem
            view={view}
            title="Duurzaamheid"
            label="sustainability"
            value={valueCheck(data[level].sustainability)}
            unit="%"
            description="De indicator duurzaamheid staat voor het percentage duurzame energie van het totale energieverbruik in het gemodelleerde gebied."
          />
          <KPIItem
            view={view}
            title="Zelfvoorzienendheid"
            label="selfSufficiency"
            value={valueCheck(data[level].selfSufficiency)}
            unit="%"
            description="De indicator zelfvoorzienendheid staat voor het percentage van het totale energieverbruik dat wordt ingevuld met eigen, gelijktijdige energieopwekking."
          />
        </React.Fragment>
      ) : (
        <span className={styles["kpiHolarchy__nodata"]}>Er is geen data op dit niveau.</span>
      )}
    </React.Fragment>
  );
}
