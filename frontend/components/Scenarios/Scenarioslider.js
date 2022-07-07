import React from "react";
import Tooltip from "./Tooltip";

function ScenarioSlider({ text, label, locked, inputid, value, updatevalue, message }) {
  return (
    <div className="mb-2 flex flex-row items-center justify-between gap-2">
      <label htmlFor={`scenario${(inputid, label)}slider`} className="flex">
        {text}
      </label>
      <div className="flex flex-row items-center justify-between gap-2">
        <input
          id={`scenario${(inputid, label)}slider`}
          type="range"
          onChange={(e) => updatevalue(inputid, e.target.value)}
          value={value}
          className="h-1 w-full cursor-pointer appearance-none bg-black dark:bg-gray-700 "
          min="0"
          max="100"
        />
        <input
          disabled={locked}
          id={`scenario${inputid}number`}
          type="number"
          onChange={(e) => updatevalue(inputid, e.target.value)}
          value={value}
          className="rounded-lg border border bg-white p-1 text-right text-holon-blue-900 shadow-[4px_4px_0_0] placeholder:font-light  placeholder:italic placeholder:text-holon-slated-blue-300 disabled:bg-slate-50 disabled:text-slate-500"
          min="0"
          max="100"
        />
        <span>%</span>
        {message && (
          <Tooltip tooltipMessage={message}>
            <span className="block h-[1rem] w-[1rem] rounded-full border bg-green-300 text-center leading-[1rem]">
              i
            </span>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default ScenarioSlider;
