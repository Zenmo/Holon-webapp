import React from "react";
import {KPIItem} from "./KPIItem";
import styles from "./KPIItem.module.css";
import {calcChangeDirection, ChangeAppreciation} from "@/components/KPIDashboard/ChangeIcon";
import {KPIsByScale} from "@/api/holon";

type KPIItems = {
  view: string;
  previousData: KPIsByScale;
  data: KPIsByScale;
  level: string;
  loading: boolean;
};

export default function KPIItems({ view, previousData, data, level, loading }: KPIItems) {
  function formatValue(value: number, empty = "-"): number | string {
    if (value == undefined || loading) {
      return empty;
    } else if (typeof value == "number") {
      return value.toFixed(1)
    } else {
      return value;
    }
  }

  function formatPreviousValue(value: number): number | string {
    return formatValue(value, "");
  }

  function formatCosts(value: number, empty = "-") {
    let unitPrefix = ""

    if (value > 1e9) {
      value = value / 1e9;
      unitPrefix = "mld.";
    } else if (value > 1e6) {
      value = value / 1e6;
      unitPrefix = "mln.";
    } else if (value > 1e3) {
      value = value / 1e3;
      unitPrefix = "k.";
    }

    return {
      value: formatValue(value, empty),
      unitPrefix,
    };
  }

  return (
    <React.Fragment>
      {data[level] ? (
        <React.Fragment>
          <KPIItem
            view={view}
            title="Netbelasting"
            label="netload"
            changeDirection={calcChangeDirection(abs(previousData[level].netload), abs(data[level].netload))}
            changeAppreciation={ChangeAppreciation.MORE_IS_WORSE}
            previousValue={formatPreviousValue(previousData[level].netload)}
            value={formatValue(data[level].netload)}
            unit="%"
            description="Deze indicator geeft de maximale belasting gedurende het jaar als percentage van het transformatorvermogen weer. Een negatieve netbelasting geeft aan dat de maximale belasting optreedt wanneer er een lokaal overschot aan energie is."
          />
          <KPIItem
            view={view}
            title="Betaalbaarheid"
            label="costs"
            changeDirection={calcChangeDirection(previousData[level].costs, data[level].costs)}
            changeAppreciation={ChangeAppreciation.MORE_IS_WORSE}
            previousValue={formatCosts(previousData[level].costs, "").value}
            value={formatCosts(data[level].costs).value}
            unit={formatCosts(data[level].costs).unitPrefix + "€/jaar"}
            previousUnit={formatCosts(previousData[level].costs, "").unitPrefix + "€/jaar"}
            description="Op lokaal niveau geeft deze indicator de totale jaarlijkse kosten voor de energievoorziening van het gesimuleerde gebied (EUR/jaar) weer."
          />
          <KPIItem
            view={view}
            title="Duurzaamheid"
            label="sustainability"
            changeDirection={calcChangeDirection(previousData[level].sustainability, data[level].sustainability)}
            changeAppreciation={ChangeAppreciation.MORE_IS_BETTER}
            previousValue={formatPreviousValue(previousData[level].sustainability)}
            value={formatValue(data[level].sustainability)}
            unit="%"
            description="De indicator duurzaamheid staat voor het percentage duurzame energie van het totale energieverbruik in het gemodelleerde gebied."
          />
          <KPIItem
            view={view}
            title="Zelfvoorzienendheid"
            label="selfSufficiency"
            changeDirection={calcChangeDirection(previousData[level].selfSufficiency, data[level].selfSufficiency)}
            changeAppreciation={ChangeAppreciation.MORE_IS_BETTER}
            previousValue={formatPreviousValue(previousData[level].selfSufficiency)}
            value={formatValue(data[level].selfSufficiency)}
            unit="%"
            description="De indicator zelfvoorzienendheid staat voor het percentage van het totale energieverbruik dat wordt ingevuld met eigen, gelijktijdige energieopwekking."
          />
        </React.Fragment>
      ) : (
        <span className={styles[view]}>Er is geen data op dit niveau.</span>
      )}
    </React.Fragment>
  );
}

function abs(value: number): number {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return NaN
    }

    return Math.abs(value)
}
