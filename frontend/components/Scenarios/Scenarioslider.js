import React from "react";

function ScenarioSlider({ inputid, value, updatevalue }) {

    return (
        <div className="flex flex-row justify-between items-center gap-2 mb-2">

            <label htmlFor={`scenario${inputid}slider`} className="flex">{inputid}</label>
            <div className="flex flex-row justify-between items-center gap-2">
                <input id={`scenario${inputid}slider`} type="range" onChange={(e) => updatevalue(e.target.value)} value={value} className="w-full h-1 bg-black appearance-none cursor-pointer dark:bg-gray-700 " min="0" max="100" />
                <input id={`scenario${inputid}number`} type="number" onChange={(e) => updatevalue(e.target.value)} value={value} className="border text-right shadow-[4px_4px_0_0] border max-w-[4rem]" min="0" max="100" />
                <span>%</span>
            </div>
        </div>
    );
}

export default ScenarioSlider;