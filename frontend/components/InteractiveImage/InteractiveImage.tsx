import { useState } from "react";

import ImageSlider from "./ImageSlider";
import ImgFlatSolar from "./ImageElements/ImgFlatSolar";

export default function InteractiveImage() {
  const [solarpanels, setSolarpanels] = useState(0);
  const [windmills, setWindmills] = useState(0);
  const [windForce, setWindForce] = useState(3);

  function updateLayers(value: string, setValue: (newValue: number) => void) {
    const newValue: number = parseInt(value);
    setValue(newValue);
  }

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
            value={solarpanels}
            setValue={setSolarpanels}
            min={0}
            max={6}
            step={1}
            label="Aantal zonnepanelen"
            updateLayers={updateLayers}
            type="range"></ImageSlider>
          <p className="mt-8 text-base">
            Bepaal hier hoeveel windmolens je in de wijk wilt neerzetten.{" "}
          </p>
          <ImageSlider
            inputId="windmills_flat"
            datatestid="windmillSlider"
            value={windmills}
            setValue={setWindmills}
            min={0}
            max={3}
            step={1}
            label="Aantal windmolens"
            updateLayers={updateLayers}
            type="range"></ImageSlider>
          <p className="mt-8 text-base">Bepaal hier hoe hard de wind waait. </p>
          <ImageSlider
            inputId="windForce_flat"
            datatestid="windforceSlider"
            value={windForce}
            setValue={setWindForce}
            min={0}
            max={12}
            step={3}
            label="Windkracht"
            updateLayers={updateLayers}
            type="range"></ImageSlider>
        </div>
        <div
          id="dataDiv"
          className=" flex flex-col p-8 lg:w-1/2"
          data-solarpanels={solarpanels}
          data-windmills={windmills}
          data-windforce={windForce}>
          <ImgFlatSolar></ImgFlatSolar>
        </div>
      </div>
    </div>
  );
}
