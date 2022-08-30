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
      <div className="mb-2 flex basis-6/12 flex-nowrap items-center justify-between py-1">
        <h3 className="text-xl">{label}</h3>
        <span className="relative ml-auto">
          <Tooltip tooltipMessage={local === true ? messageLocal : messageNl} result={true}>
            <output
              data-testid={`result${label}`}
              style={{ backgroundColor: per2colorArray(minvalue, maxvalue, inputValue, invert) }}
              className={`block h-[4.5rem] w-[4.5rem] rounded-full border-2 border-holon-blue-900 text-center text-lg font-medium italic leading-[4.5rem] shadow-[2px_2px_0_0]`}
            >
              {inputValueAltRepr(inputValue, unit)}
            </output>
          </Tooltip>
        </span>

        <span className="ml-2 mr-5 w-[40px] text-lg font-medium italic">{unit}</span>
      </div>
    </>
  );
}
