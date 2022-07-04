import React from "react";
import Tooltip from "./Tooltip";



function Scenarioresultitem({ label, unit, value, tooltip }) {

    const inpuvalue = parseFloat(value)

    const color = (inpuvalue < 25) ? 'bg-red-300' : (inpuvalue < 45) ? 'bg-orange-300' : (inpuvalue < 75) ? 'bg-yellow-300' : 'bg-green-300'

    return (
        <React.Fragment>


            <div className="flex flex-wrap justify-between items-center mb-2">
                <h3 className="text-xl" >{label}</h3>
                <span className="relative ml-auto">
                    {tooltip ?
                        <Tooltip tooltipMessage={tooltip}>
                            <output className={`border rounded-full block text-center leading-[3rem] h-[3rem] w-[3rem] shadow-[2px_2px_0_0] ${color}`}>{value}</output>
                            <sup className="absolute right-0 top-0 border rounded-full block text-center leading-[1rem] h-[1rem] w-[1rem] bg-green-300">i</sup>
                        </Tooltip>
                        :
                        <output className={`border rounded-full block text-center  leading-[3rem] h-[3rem] w-[3rem] shadow-[2px_2px_0_0] border ${color}`}>{value}</output>
                    }
                </span>
                <span className="italic ml-2 w-[40px]">{unit}</span>
            </div>


        </React.Fragment>
    );
}

export default Scenarioresultitem;