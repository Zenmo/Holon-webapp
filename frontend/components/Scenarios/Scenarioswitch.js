import React from "react";

function Scenarioswitch({label, inputid, value, updatevalue,on,off }) {

    return (
        <React.Fragment>
            <div className="flex flex-row justify-between">
                <label htmlFor={`scenario${inputid}slider`} className="text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">{label}</label>

                <label htmlFor={`scenario${inputid}slider`} className="flex gap-1 items-center">
                    <small>{off}</small>
                    <span className=" relative ">
                        <input type="checkbox" value="" id={`scenario${inputid}slider`} className="sr-only peer" onChange={(e) => updatevalue(e.target.checked)} checked={value} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </span>
                    <small>{on}</small>
                </label>
            </div>
        </React.Fragment>
    );
}

export default Scenarioswitch;