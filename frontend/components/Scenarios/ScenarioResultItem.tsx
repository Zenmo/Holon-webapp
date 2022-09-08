import Tooltip from "./Tooltip";
import { resultScale } from "./resultScale";

import type { SubjectResult } from "./types";

type Props = React.PropsWithChildren<{
  invert?: boolean;
  label: string;
  local: boolean;
  maxvalue: number;
  messageLocal: string;
  messageNl: string;
  minvalue: number;
  unit: string;
  value: SubjectResult;
}>;

function inputValueAltRepr(inputValue: number, unit: string) {
  if (isNaN(inputValue)) {
    return "";
  }

  // Checks if the inputValue should actually be a plus or minus sign
  if (unit == " ") {
    if (inputValue == 100) {
      return "✔";
    } else if (inputValue == 0) {
      return "✗";
    }
  }

  return inputValue;
}

function per2colorArray(minvalue: number, maxvalue: number, value: number, invert: boolean) {
  let percentage = 0;

  if (value <= minvalue) {
    percentage = 0;
  } else if (value >= maxvalue) {
    percentage = 100;
  } else {
    percentage = ((value - minvalue) / (maxvalue - minvalue)) * 100;
  }

  if (invert) {
    percentage = 100 - percentage;
  }

  return resultScale[percentage];
}

export default function ScenarioResultItem({
  invert = false,
  label,
  local,
  maxvalue = 100,
  messageLocal,
  messageNl,
  minvalue,
  unit,
  value,
}: Props) {
  const inputValue = local ? value.local : value.national;

  return (
    <>
      <div className="mb-2 flex basis-6/12 flex-nowrap items-center justify-between py-1 flex-col  lg:flex-row lg:justify-start lg:gap-2 xl:justify-between">
        <h3 className="text-xs md:text-sm lg:text-base xl:text-lg">{label}</h3>
        <div className="flex flex-row justify-around items-center mt-2 xl:w-[150px] xl:justify-start" >
        <span className="relative">
          <Tooltip tooltipMessage={local === true ? messageLocal : messageNl} result={true}>
            <output
              data-testid={`result${label}`}
              style={{ backgroundColor: per2colorArray(minvalue, maxvalue, inputValue, invert) }}
              className={`block h-8 w-8 rounded-full border-2 border-holon-blue-900 text-center text-[0.6rem] font-medium italic leading-6 shadow-[2px_2px_0_0] sm:text-xs sm:leading-7 md:h-12 md:w-12 md:text-sm md:leading-10 lg:h-[3.5rem] lg:w-[3.5rem] lg:text-base lg:leading-[3.5rem] xl:text-lg xl:leading-[4rem] xl:h-[4rem] xl:w-[4rem]`}
            >
              {inputValueAltRepr(inputValue, unit)}
            </output>
          </Tooltip>
        </span>
        {unit.trim() &&
        <span className="ml-2 text-xs font-medium italic sm:text-sm md:text-base lg:text-lg">
          {unit}
        </span>
}
        </div>
      </div>
    </>
  );
}
