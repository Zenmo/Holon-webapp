import React from "react";
import Tooltip from "./Tooltip";

function Scenarioswitch({ locked, neighbourhoodID, inputid, value, updatevalue, on, off, label }) {
  return (
    <div className="flex flex-row items-center justify-end gap-2">
      <label
        htmlFor={`scenario${inputid}slider${neighbourhoodID}`}
        className="mr-auto cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {label}
      </label>

      <label
        htmlFor={`scenario${inputid}slider${neighbourhoodID}`}
        className="flex items-center gap-1"
      >
        <small>{off}</small>
        <span className=" relative mx-1">
          <input
            disabled={locked}
            type="checkbox"
            value=""
            id={`scenario${inputid}switch${neighbourhoodID}`}
            className="peer sr-only"
            onChange={(e) => updatevalue(inputid, e.target.checked)}
            checked={value}
          />
          <div className="bg-yellow h-[30px] w-16 rounded-lg border p-1 text-holon-blue-900 shadow-[4px_4px_0_0] after:absolute after:top-[7px] after:left-[2px]  after:h-[1rem] after:w-5 after:rounded-md after:border-holon-blue-900 after:bg-holon-blue-500 after:shadow-[2px_2px_0_0]   after:transition-all after:content-[''] peer-checked:after:left-[-2px] peer-checked:after:translate-x-[200%] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-disabled:bg-slate-50 peer-disabled:text-slate-500"></div>
        </span>
        <small>{on}</small>
      </label>
      <Tooltip tooltipMessage="Some description"></Tooltip>
    </div>
  );
}

export default Scenarioswitch;
