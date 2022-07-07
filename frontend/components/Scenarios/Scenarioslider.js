import React from "react";
import Tooltip from "./Tooltip";

function ScenarioSlider({ neighbourhoodID, locked, inputid, value, updatevalue, label, message }) {
  return (
    <div className="mb-2 flex flex-row items-center justify-between gap-2">
      <label htmlFor={`scenario${(inputid, neighbourhoodID)}slider`} className="flex">
        {label}
      </label>
      <div className="flex flex-row items-center justify-between gap-2">
        <input
          id={`scenario${(inputid, neighbourhoodID)}slider`}
          type="range"
          onChange={(e) => updatevalue(inputid, e.target.value)}
          value={value}
          className={`w-50 h-1 ${
            locked && "cursor-not-allowed"
          } appearance-none bg-black dark:bg-gray-700 `}
          min="0"
          max="100"
        />
        <input
          disabled={locked}
          id={`scenario${inputid}number`}
          type="number"
          onChange={(e) => updatevalue(inputid, e.target.value)}
          value={value}
          className={`w-16 ${
            locked && "cursor-not-allowed"
          } rounded-sm border-2 border-holon-blue-900 bg-white p-1 text-right text-holon-blue-900 shadow-holon-blue placeholder:font-light placeholder:italic placeholder:text-holon-slated-blue-300 disabled:text-slate-500`}
          min="0"
          max="100"
        />
        <span>%</span>
        <Tooltip tooltipMessage={message}></Tooltip>
      </div>
    </div>
  );
}

export default ScenarioSlider;
