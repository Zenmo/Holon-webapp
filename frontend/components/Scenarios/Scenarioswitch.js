import React from "react";

function Scenarioswitch({ label, inputid, value, updatevalue, on, off }) {

    return (
        <div className="flex flex-row justify-between">
            <label htmlFor={`scenario${inputid}slider`} className="text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">{label}</label>

            <label htmlFor={`scenario${inputid}slider`} className="flex gap-1 items-center">
                <small>{off}</small>
                <span className=" relative mx-1">
                    <input type="checkbox" value="" id={`scenario${inputid}slider`} className="sr-only peer" onChange={(e) => updatevalue(e.target.checked)} checked={value} />
                    <div className="w-16 h-6 bg-yellow peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 shadow-[2px_2px_0_0] border border-black  peer-checked:after:translate-x-[200%] after:content-[''] after:absolute after:top-[3px] after:left-[2px] after:bg-blue-600 after:border-gray-300  after:h-4 after:w-5 after:transition-all after:shadow-[2px_2px_0_0] after:border-black peer-checked:after:left-[-2px]"></div>
                </span>
                <small>{on}</small>
            </label>
        </div>
    );
}

export default Scenarioswitch;