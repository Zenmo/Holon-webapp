import {BoltIcon, CurrencyEuroIcon, GlobeEuropeAfricaIcon, MapPinIcon,} from "@heroicons/react/24/solid";

import styles from "./KPIItem.module.css";
import InteractiveInputPopover from "../InteractiveInputs/InteractiveInputPopover";

type Props = {
  title: string;
  label: string;
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

export default function KPIItem({ title, label, value, unit, view, description }: Props) {
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
        <div>
          <output>{value} </output>
          <span>{unit}</span>
        </div>
      </div>
    </div>
  );
}
