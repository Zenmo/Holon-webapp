import { useEffect, useState, useRef } from "react";

import ImageSlider from "./ImageSlider";
import ImgFlatSolar from "./ImgFlatSolar";

export default function InteractiveImage() {
  const [zonnepanelen, setZonnepanelen] = useState(0);
  const [windmills, setWindmills] = useState(0);

  const prevNumSolar: number = usePrevious<number>(zonnepanelen);
  const prevNumWind: number = usePrevious<number>(windmills);
  let layersSolar: Element[] = [];
  let layersWind: Element[] = [];

  function updateLayers(value: string, setValue: (newValue: number) => void) {
    const newValue: number = parseInt(value);
    setValue(newValue);
  }

  function usePrevious<T>(value: T): T {
    const ref: any = useRef<T>();
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)
    return ref.current;
  }

  useEffect(() => {
    layersSolar = Array.from(document.getElementsByClassName("solarpanelBlock"));
    layersWind = Array.from(document.getElementsByClassName("windmill"));
    showLayers(prevNumSolar, zonnepanelen, layersSolar);
    showLayers(prevNumWind, windmills, layersWind);
  });

  function showLayers(prevAmount: number, newAmount: number, layers: Element[]) {
    const difference = Math.sign(newAmount - prevAmount);

    //to add -> if slider value is more than available in array breaks now
    if (difference === 0) {
      return;
    } else if (difference === 1) {
      for (let i = 0; i < newAmount; i++) {
        layers[i].classList.remove("animate-riseUp");
        layers[i].classList.replace("opacity-0", "animate-fallDown");
      }
    } else if (difference === -1) {
      for (let i = layers.length - 1; i >= newAmount; i--) {
        if (layers[i].classList.contains("animate-fallDown")) {
          layers[i].classList.replace("animate-fallDown", "animate-riseUp");
          layers[i].classList.add("opacity-0");
        }
      }
    }
  }

  return (
    <div className="flex w-full flex-col">
      <h2 className="mx-8 text-xl font-bold">Flat Holon Interactie</h2>
      <div className="flex flex-row">
        <div className="mx-8 flex w-1/3 flex-col">
          <p className="mt-8 text-base">
            Bepaal hier hoeveel zonnepanelen je op het dak van de flat plaatst.{" "}
          </p>
          <ImageSlider
            inputId="zonnepanelen_flat"
            value={zonnepanelen}
            setValue={setZonnepanelen}
            min={0}
            max={6}
            step={1}
            label="Aantal zonnepanelen"
            updateLayers={updateLayers}
            type="range"
          ></ImageSlider>
          <p className="mt-8 text-base">
            Bepaal hier hoeveel windmolens je in de wijk wilt neerzetten.{" "}
          </p>
          <ImageSlider
            inputId="windmills_flat"
            value={windmills}
            setValue={setWindmills}
            min={0}
            max={3}
            step={1}
            label="Aantal windmolens"
            updateLayers={updateLayers}
            type="range"
          ></ImageSlider>
        </div>
        <div className=" mx-8 flex w-2/3 flex-col">
          <ImgFlatSolar></ImgFlatSolar>
        </div>
      </div>
    </div>
  );
}
