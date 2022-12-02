import {
  BoltIcon,
  CurrencyEuroIcon,
  GlobeEuropeAfricaIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";

type Props = {
  title: string;
  label: string;
  value: string | number;
  unit: string;
};

const iconMap = {
  netload: <BoltIcon />,
  costs: <CurrencyEuroIcon />,
  sustainability: <GlobeEuropeAfricaIcon />,
  selfSufficiency: <MapPinIcon />,
};

export default function KPIItem({ title, label, value, unit }: Props) {
  return (
    <div className="flex flex-col bg-transparant text-white justify-between items-center p-6 w-1/4">
      <span className="mb-2 text-xs md:text-base lg:text-lg">{title}</span>
      <span className=" w-1/3 md:w-1/5 mb-4">{iconMap[label]}</span>
      <div className="flex flex-row items-center">
        <span className="text-xl md:text-3xl font-bold mr-1">{value} </span>
        <span className="text-base font-light">{unit}</span>
      </div>
    </div>
  );
}
