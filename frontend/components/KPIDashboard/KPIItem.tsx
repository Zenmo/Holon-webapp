import {BoltIcon, CurrencyEuroIcon, GlobeEuropeAfricaIcon, MapPinIcon,} from "@heroicons/react/24/solid";

import styles from "./KPIItem.module.css";
import InteractiveInputPopover from "../InteractiveInputs/InteractiveInputPopover";
import {ChangeAppreciation, ChangeDirection, ChangeIcon} from "@/components/KPIDashboard/ChangeIcon";
import {FunctionComponent} from "react";

type Props = {
  title: string;
  label: string;
  changeDirection: ChangeDirection;
  changeAppreciation: ChangeAppreciation;
  previousValue: string | number;
  previousUnit?: string;
  value: string | number;
  unit: string;
  view: string;
  description: string;
};

const iconMap = {
  netload: <BoltIcon />,
  costs: <CurrencyEuroIcon />,
  sustainability: <GlobeEuropeAfricaIcon />,
  selfSufficiency: <MapPinIcon />,
};

export const KPIItem: FunctionComponent<Props> = ({
    title,
    label,
    previousValue,
    value,
    unit,
    previousUnit,
    view,
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
        <div>
          <ChangeIcon changeDirection={changeDirection} changeAppreciation={changeAppreciation} />
          <output>{value} </output>
          <span>{unit}</span>
        </div>
      </div>
    </div>
  );
}
