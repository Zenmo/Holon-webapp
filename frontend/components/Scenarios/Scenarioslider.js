import React from "react";

function ScenarioSlider({ inputid, value, updatevalue }) {

    return (
        <div className="flex flex-row justify-between items-center gap-2 mb-2">

            <label htmlFor={`scenario${inputid}slider`} className="flex">{inputid}</label>
            <div className="flex flex-row justify-between items-center gap-2">
                <input id={`scenario${inputid}slider`} type="range" onChange={(e) => updatevalue(e.target.value)} value={value} className="w-full h-1 bg-black appearance-none cursor-pointer dark:bg-gray-700 " min="0" max="100" />
                <input id={`scenario${inputid}number`} type="number" onChange={(e) => updatevalue(e.target.value)} value={value} className="rounded-lg p-1 placeholder:font-light placeholder:italic placeholder:text-holon-slated-blue-300 border border bg-white text-holon-blue-900  shadow-[4px_4px_0_0] text-right" min="0" max="100" />
                <span>%</span>
            </div>
        </div>
    );
}

export default ScenarioSlider;