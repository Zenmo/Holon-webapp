import {
  BoltIcon,
  CurrencyEuroIcon,
  GlobeEuropeAfricaIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";

import styles from "./KPIItem.module.css";

type Props = {
  title: string;
  label: string;
  value: string | number;
  unit: string;
  view: string;
};

const iconMap = {
  netload: <BoltIcon />,
  costs: <CurrencyEuroIcon />,
  sustainability: <GlobeEuropeAfricaIcon />,
  selfSufficiency: <MapPinIcon />,
};

export default function KPIItem({ title, label, value, unit, view }: Props) {
  return (
    <div className={styles[view]}>
      <div>
        <span data-class="kpiTitle">{title}</span>
        <span data-class="kpiIcon">{iconMap[label]}</span>
        <div>
          <output>{value} </output>
          <span>{unit}</span>
        </div>
      </div>
    </div>
  );
}
