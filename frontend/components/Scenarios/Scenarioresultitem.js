import React from "react";
import Tooltip from "./Tooltip";

function Scenarioresultitem({
  label,
  unit,
  value,
  tooltip,
  local,
  invert,
  messageLocal,
  messageNl,
  minvalue,
}) {
  function perc2color(minvalue, maxvalue, value) {
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

    // var percentage = perc < 100 ? perc : 100

    var r,
      g,
      b = 0;
    if (percentage < 50) {
      r = 255;
      g = Math.round(5.1 * percentage);
    } else {
      g = 255;
      r = Math.round(510 - 5.1 * percentage);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return "#" + ("000000" + h.toString(16)).slice(-6);
  }

  const maxvalue = unit == "%" ? 100 : 10000;
  const inputvalue = parseFloat(local ? value.local : value.national);

  return (
    <React.Fragment>
      <div className="mb-2 flex flex-wrap items-center justify-between">
        <h3 className="text-xl">{label}</h3>
        <span className="relative ml-auto">
          <Tooltip tooltipMessage={local ? messageLocal : messageNl} result={true}>
            <output
              style={{ backgroundColor: perc2color(minvalue, maxvalue, inputvalue, invert) }}
              className={`block h-[3rem] w-[3rem] rounded-full border text-center leading-[3rem] shadow-[2px_2px_0_0]`}
            >
              {inputvalue}
            </output>
          </Tooltip>
        </span>

        <span className="ml-2 w-[40px] italic">{unit}</span>
      </div>
    </React.Fragment>
  );
}

export default Scenarioresultitem;
