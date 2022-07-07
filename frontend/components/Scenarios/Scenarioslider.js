import React from "react";
import Tooltip from "./Tooltip";

function ScenarioSlider({ label, locked, inputid, value, updatevalue }) {

    return (
        <div className="flex flex-row justify-between items-center gap-2 mb-2">

            <label htmlFor={`scenario${inputid, label}slider`} className="flex">{inputid}</label>
            <div className="flex flex-row justify-between items-center gap-2">
                <input id={`scenario${inputid, label}slider`} type="range" onChange={(e) => updatevalue(inputid, e.target.value)} value={value} className="w-full h-1 bg-black appearance-none cursor-pointer dark:bg-gray-700 " min="0" max="100" />
                <input disabled={locked} id={`scenario${inputid}number`} type="number" onChange={(e) => updatevalue(inputid, e.target.value)} value={value} className="rounded-lg p-1 placeholder:font-light placeholder:italic placeholder:text-holon-slated-blue-300 border border bg-white text-holon-blue-900  shadow-[4px_4px_0_0] text-right disabled:bg-slate-50 disabled:text-slate-500" min="0" max="100" />
                <span>%</span>
                <Tooltip tooltipMessage="Some description">
                    <span className="border rounded-full block text-center leading-[1rem] h-[1rem] w-[1rem] bg-green-300">i</span>
                </Tooltip>

            </div>
        </div>
    );
}

export default ScenarioSlider;