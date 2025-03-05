import { useState } from "react"

import ImgFlatSolar from "./ImageElements/ImgFlatSolar"
import ImageSlider from "./ImageSlider"

export default function InteractiveImage() {
    const [solarpanels, setSolarpanels] = useState(0)
    const [windmills, setWindmills] = useState(0)
    const [windForce, setWindForce] = useState(3)

    return (
        <div className="flex w-full flex-col">
            <div className="flex flex-col lg:flex-row">
                <div className="flex flex-col p-8 lg:w-1/2">
                    <h2 className=" mt-8 text-2xl font-bold">Flat Holon Interactie</h2>
                    <p className="mt-8 text-base">
                        Bepaal hier hoeveel zonnepanelen je op het dak van de flat plaatst.{" "}
                    </p>
                    <ImageSlider
                        inputId="solarPanels_flat"
                        datatestid="solarpanelSlider"
                        defaultValue={solarpanels}
                        setValue={(id, value) => setSolarpanels(value)}
                        min={0}
                        max={6}
                        label="Aantal zonnepanelen"
                        type="range"
                    ></ImageSlider>
                    <p className="mt-8 text-base">
                        Bepaal hier hoeveel windmolens je in de wijk wilt neerzetten.{" "}
                    </p>
                    <ImageSlider
                        inputId="windmills_flat"
                        datatestid="windmillSlider"
                        defaultValue={windmills}
                        setValue={(id, value) => setWindmills(value)}
                        min={0}
                        max={3}
                        label="Aantal windmolens"
                        type="range"
                    ></ImageSlider>
                    <p className="mt-8 text-base">Bepaal hier hoe hard de wind waait. </p>
                    <ImageSlider
                        inputId="windForce_flat"
                        datatestid="windforceSlider"
                        defaultValue={windForce}
                        setValue={(id, value) => setWindForce(value)}
                        min={0}
                        max={12}
                        step={5} // 0 3 6 9 12
                        label="Windkracht"
                        type="range"
                    ></ImageSlider>
                </div>
                <div
                    id="dataDiv"
                    className=" flex flex-col p-8 lg:w-1/2"
                    data-solarpanels={solarpanels}
                    data-windmills={windmills}
                    data-windforce={windForce}
                >
                    <ImgFlatSolar></ImgFlatSolar>
                </div>
            </div>
        </div>
    )
}
