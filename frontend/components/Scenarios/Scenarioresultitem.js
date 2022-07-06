import React from "react";
import Tooltip from "./Tooltip";



function Scenarioresultitem({ label, unit, value, tooltip, local }) {

    function perc2color(perc) {
        var percentage = perc < 100 ? perc : 100

        var r, g, b = 0;
        if (percentage < 50) {
            r = 255;
            g = Math.round(5.1 * perc);
        }
        else {
            g = 255;
            r = Math.round(510 - 5.10 * percentage);
        }
        var h = r * 0x10000 + g * 0x100 + b * 0x1;
        return '#' + ('000000' + h.toString(16)).slice(-6);
    }




    const maxvalue = unit == '%' ? 100 : 10000
    const inpuvalue = parseFloat(local ? value.local : value.national)



    return (
        <React.Fragment>
            <div className="flex flex-wrap justify-between items-center mb-2">
                <h3 className="text-xl" >{label}</h3>
                {inpuvalue > 0 &&
                    <span className="relative ml-auto">
                        {tooltip ?
                            <Tooltip tooltipMessage={tooltip}>
                                <output style={{ backgroundColor: perc2color((inpuvalue / maxvalue) * 100) }} className={`border rounded-full block text-center leading-[3rem] h-[3rem] w-[3rem] shadow-[2px_2px_0_0]`}>{inpuvalue}</output>
                                <sup className="absolute right-0 top-0 border rounded-full block text-center leading-[1rem] h-[1rem] w-[1rem] bg-green-300">i</sup>
                            </Tooltip>
                            :
                            <output style={{ backgroundColor: perc2color((inpuvalue / maxvalue) * 100) }} className={`border rounded-full block text-center  leading-[3rem] h-[3rem] w-[3rem] shadow-[2px_2px_0_0] border`}>{inpuvalue}</output>
                        }
                    </span>
                }
                <span className="italic ml-2 w-[40px]">{unit}</span>
            </div>
        </React.Fragment>
    );
}

export default Scenarioresultitem;