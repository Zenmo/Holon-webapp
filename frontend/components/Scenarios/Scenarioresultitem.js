import React from "react";
import Tooltip from "./Tooltip";

function Scenarioresultitem({ label, unit, value, tooltip, local }) {
  function perc2color(perc) {
    var percentage = perc < 100 ? perc : 100;

    var r,
      g,
      b = 0;
    if (percentage < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    } else {
      g = 255;
      r = Math.round(510 - 5.1 * percentage);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return "#" + ("000000" + h.toString(16)).slice(-6);
  }

  const maxvalue = unit == "%" ? 100 : 10000;
  const inpuvalue = parseFloat(local ? value.local : value.national);

  return (
    <React.Fragment>
      <div className="mb-2 flex flex-wrap items-center justify-between">
        <h3 className="text-xl">{label}</h3>
        {inpuvalue > 0 && (
          <span className="relative ml-auto">
            {tooltip ? (
              <Tooltip tooltipMessage={tooltip} result={true}>
                <output
                  style={{ backgroundColor: perc2color((inpuvalue / maxvalue) * 100) }}
                  className={`block h-[3rem] w-[3rem] rounded-full border text-center leading-[3rem] shadow-[2px_2px_0_0]`}
                >
                  {inpuvalue}
                </output>
              </Tooltip>
            ) : (
              <output
                style={{ backgroundColor: perc2color((inpuvalue / maxvalue) * 100) }}
                className={`block h-[3rem] w-[3rem] rounded-full  border border text-center leading-[3rem] shadow-[2px_2px_0_0]`}
              >
                {inpuvalue}
              </output>
            )}
          </span>
        )}
        <span className="ml-2 w-[40px] italic">{unit}</span>
      </div>
    </React.Fragment>
  );
}

export default Scenarioresultitem;
