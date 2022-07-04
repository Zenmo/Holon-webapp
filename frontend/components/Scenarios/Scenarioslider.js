import React from "react";

function ScenarioSlider({ inputid, value, updatevalue }) {

    return (
        <div className="flex flex-row justify-between items-center gap-2 mb-2">

            <label htmlFor={`scenario${inputid}slider`} className="flex">{inputid}</label>
            <div className="flex flex-row justify-between items-center gap-2">
                <input id={`scenario${inputid}slider`} type="range" onChange={(e) => updatevalue(e.target.value)} value={value} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" min="0" max="100" />
                <input id={`scenario${inputid}number`} type="number" onChange={(e) => updatevalue(e.target.value)} value={value} className="border text-right" min="0" max="100" />
            </div>
        </div>
    );
}

export default ScenarioSlider;