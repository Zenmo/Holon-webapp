import React from "react";

function Scenarioswitch({ locked, label, inputid, value, updatevalue, on, off }) {

    return (
        <div className="flex flex-row justify-between">
            <label htmlFor={`scenario${inputid}slider`} className="text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">{label}</label>

            <label htmlFor={`scenario${inputid}slider`} className="flex gap-1 items-center">
                <small>{off}</small>
                <span className=" relative mx-1">
                    <input disabled={locked} type="checkbox" value="" id={`scenario${inputid}slider`} className="sr-only peer" onChange={(e) => updatevalue(e.target.checked)} checked={value} />
                    <div className="text-holon-blue-900 rounded-lg p-1 w-16 h-[30px] bg-yellow peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 shadow-[4px_4px_0_0] border  peer-checked:after:translate-x-[200%] after:content-[''] after:absolute after:top-[7px] after:left-[2px] after:bg-holon-blue-500   after:h-[1rem] after:w-5 after:transition-all after:shadow-[2px_2px_0_0] after:border-holon-blue-900 peer-checked:after:left-[-2px] after:rounded-md peer-disabled:bg-slate-50 peer-disabled:text-slate-500"></div>
                </span>
                <small>{on}</small>
            </label>
        </div>
    );
}

export default Scenarioswitch;