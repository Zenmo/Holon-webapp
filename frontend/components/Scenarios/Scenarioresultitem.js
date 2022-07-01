import React from "react";
import Button from "../Button";

function Scenarioresultitem({ label, unit, value }) {

    return (
        <React.Fragment>


            <div className="flex flex-wrap justify-between items-center px-2">
                <h3 className="text-xl" >{label}</h3>
                <span className="relative ml-auto">
                <output className="border rounded-full block text-center  leading-[3rem] h-[3rem] w-[3rem] bg-orange-300">{value}</output>
                <sup className="absolute right-0 top-0 border rounded-full block text-center leading-[1rem] h-[1rem] w-[1rem] bg-green-300">i</sup>
                </span>
                <span className="italic">{unit}</span>
            </div>


        </React.Fragment>
    );
}

export default Scenarioresultitem;