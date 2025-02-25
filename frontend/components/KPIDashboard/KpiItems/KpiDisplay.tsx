import {BoltIcon, CurrencyEuroIcon, GlobeEuropeAfricaIcon, MapPinIcon,} from "@heroicons/react/24/solid";

import styles from "../kpi.module.css";
import InteractiveInputPopover from "../../InteractiveInputs/InteractiveInputPopover";
import {ChangeAppreciation, ChangeDirection, ChangeIcon} from "@/components/KPIDashboard/ChangeIcon";
import {FunctionComponent} from "react";

export type KpiView = "kpiStoryline" | "kpiHolarchy"

type Props = {
  title: string;
  label: string;
  changeDirection: ChangeDirection;
  changeAppreciation: ChangeAppreciation;
  previousValue: string;
  previousUnit?: string;
  value: string;
  unit: string;
  view?: KpiView;
  description: string;
};

const iconMap = {
  netload: <BoltIcon />,
  costs: <CurrencyEuroIcon />,
  sustainability: <GlobeEuropeAfricaIcon />,
  selfSufficiency: <MapPinIcon />,
};

export type KpiDisplayValue = {
    value: string, // formatted number
    multiplier?: string, // "k" or "mln"
    unit: string,
}

/**
 * Component which doesn't do any number formatting, just put the strings in the layout
 */
export const KpiDisplay: FunctionComponent<Props> = ({
    title,
    label,
    previousValue,
    value,
    unit,
    previousUnit,
    view = "kpiStoryline",
    description,
    changeDirection,
    changeAppreciation,
}) => {
  return (
    <div className={styles[view]}>
      <div>
        <span data-class="kpiTitle">
          {title}
          <InteractiveInputPopover
            data-class="kpiInfo"
            textColor="text-holon-blue-900"
            name={title}
            moreInformation={description}
            // This link is brittle since it is a reference to content in the CMS.
            linkWikiPage={"wiki/gebruikershandleiding/3-key-perfomance-indicatoren/kpi-" + title.toLowerCase()}
            target="_blank"/>
        </span>
        <span data-class="kpiIcon">{iconMap[label]}</span>
        {view === "kpiStoryline" &&
          <div style={{
            fontSize: "1rem",
            color: "lightgray",
            alignSelf: "start",
            height: "1lh",
          }}>
            <output style={{
              fontSize: "1rem",
              fontWeight: "normal",
            }}>{previousValue}</output>
            <span>{previousValue && (previousUnit || unit)}</span>
          </div>
        }
        <div>
          <ChangeIcon changeDirection={changeDirection} changeAppreciation={changeAppreciation} />
          <output>{value} </output>
          <span>{unit}</span>
        </div>
      </div>
    </div>
  );
}
