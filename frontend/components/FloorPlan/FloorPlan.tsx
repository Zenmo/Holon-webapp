import React, { useState } from "react"
/* eslint-disable @next/next/no-img-element */

const tileImages = [
    "detailhandel",
    "distributie",
    "electriciteitscluster",
    "fabriekA",
    "fabriekB",
    "windmolenpark_zee",
]

export default function FloorPlan() {
    const [gridSize, setGridSize] = useState(30)

    function changeGrid() {
        //multiply with 10, to also change the grid when the value stays the same
        setGridSize(Math.random() * 30 + 20)
    }

    const size = Math.floor(gridSize / 10)

    return (
        <React.Fragment>
            <h1>Proof of concept tiles</h1>
            <button
                className="border-holon-blue-900 text-white bg-holon-blue-900 hover:bg-holon-blue-500 flex flex-row justify-center items-center relative rounded border-2 nowrap px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50"
                onClick={() => changeGrid()}
            >
                Refresh tiles
            </button>

            <div data-size={size} className="floorplan">
                {Array(Math.pow(size, 2))
                    .fill(1)
                    .map((i, index) => {
                        const randomImage = tileImages[Math.floor(Math.random() * 6)]
                        return (
                            <div className={`floorplan__tile w-1/${size}`} key={index}>
                                <img
                                    alt={randomImage}
                                    className="floorplan__img"
                                    src={`/img/tiles/${randomImage}.png`}
                                />
                            </div>
                        )
                    })}
            </div>
            <span className="w-1/1 w-1/2 w-1/3 w-1/4 h-1/1 h-1/2 h-1/3 h-1/4"></span>
        </React.Fragment>
    )
}
