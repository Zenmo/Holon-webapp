import { ClockIcon } from "@heroicons/react/24/solid";

type Props = {
  label: string;
  value: string | number;
  unit: string;
};

export default function KPIItem({ label, value, unit }: Props) {
  return (
    <div className="flex flex-col bg-transparant h-44 text-white justify-between items-center p-8 w-1/4">
      <p>{label}</p>
      <span className="w-[25%]">
        <ClockIcon></ClockIcon>
      </span>
      <div className="flex flex-row items-center">
        <span className="text-2xl font-bold mr-1">{value} </span>
        <span className="text-base font-light">{unit}</span>
      </div>
    </div>
  );
}