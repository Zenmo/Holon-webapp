import React from "react";
import PropTypes from "prop-types";
import Tooltip from "./Tooltip";
import { resultScale } from "./resultScale";

function ScenarioResultItem({
  label,
  unit,
  value,
  local,
  invert,
  messageLocal,
  messageNl,
  minvalue,
  maxvalue = 100,
}) {
  function per2colorArray(minvalue, maxvalue, value, invert) {
    var percentage = 0;

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

    percentage = parseInt(percentage);
    var color = resultScale[percentage];

    return color;
  }

  const inputValue = parseFloat(local ? value.local : value.national);

  function inputValueAltRepr(inputValue) {
    if (isNaN(inputValue)) {
      inputValue = "";
    }

    // Checks if the inputValue should actually be a plus or minus sign
    if (unit == " ") {
      if (inputValue == 100) {
        inputValue = "✔";
      } else if (inputValue == 0) {
        inputValue = "✗";
      }
    }

    return inputValue;
  }

  return (
    <React.Fragment>
      <div className="mb-2 flex basis-6/12 flex-nowrap items-center justify-between py-1">
        <h3 className="text-xl">{label}</h3>
        <span className="relative ml-auto">
          <Tooltip tooltipMessage={local === true ? messageLocal : messageNl} result={true}>
            <output
              data-testid={`result${label}`}
              style={{ backgroundColor: per2colorArray(minvalue, maxvalue, inputValue, invert) }}
              className={`block h-[4.5rem] w-[4.5rem] rounded-full border-2 border-holon-blue-900 text-center text-lg font-medium italic leading-[4.5rem] shadow-[2px_2px_0_0]`}
            >
              {inputValueAltRepr(inputValue)}
            </output>
          </Tooltip>
        </span>

        <span className="ml-2 mr-5 w-[40px] text-lg font-medium italic">{unit}</span>
      </div>
    </React.Fragment>
  );
}

export default ScenarioResultItem;

ScenarioResultItem.propTypes = {
  children: PropTypes.object,
  borderColor: PropTypes.string,
  scenarioId: PropTypes.string,
  setLocal: PropTypes.func,
  windholon: PropTypes.bool,
  heatholon: PropTypes.bool,

  label: PropTypes.string,
  unit: PropTypes.string,
  value: PropTypes.shape({
    local: PropTypes.number,
    national: PropTypes.number,
  }),
  local: PropTypes.bool,
  invert: PropTypes.bool,
  messageLocal: PropTypes.string,
  messageNl: PropTypes.string,
  minvalue: PropTypes.number,
  maxvalue: PropTypes.number,
};
