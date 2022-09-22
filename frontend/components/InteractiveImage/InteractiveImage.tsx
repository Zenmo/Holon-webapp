import { useState } from "react";

import ImageSlider from "./ImageSlider";
//import ImageLayer from "./ImageLayer";

export default function InteractiveImage() {
  const [zonnepanelen, setZonnepanelen] = useState(0);

  function updateLayers(value: string) {
    const newValue = parseInt(value);
    setZonnepanelen(newValue);
  }

  const layers = [
    {
      id: "solarpanel1",
      src: "/imgs/zonnepanelen_blok.png",
      top: "top-0",
      left: "left-0",
      width: "",
    },
    {
      id: "solarpanel2",
      src: "/imgs/zonnepanelen_blok_bijgesneden.png",
      top: "top-[11.5%]",
      left: "left-[56.45%]",
      width: "w-[10.1052632%]",
    },
    {
      id: "solarpanel4",
      src: "/imgs/zonnepanelen_blok_bijgesneden.png",
      top: "top-[16%]",
      left: "left-[43%]",
      width: "w-[10.1052632%]",
    },
    {
      id: "solarpanel3",
      src: "/imgs/zonnepanelen_blok_bijgesneden.png",
      top: "top-[11%]",
      left: "left-[47%]",
      width: "w-[10.1052632%]",
    },
    {
      id: "solarpanel5",
      src: "/imgs/zonnepanelen_blok_bijgesneden.png",
      top: "top-[16%]",
      left: "left-[34%]",
      width: "w-[10.1052632%]",
    },
    {
      id: "solarpanel6",
      src: "/imgs/zonnepanelen_blok_bijgesneden.png",
      top: "top-[6%]",
      left: "left-[42%]",
      width: "w-[10.1052632%]",
    },
  ];

  const placeLayers = () => {
    const amount = zonnepanelen;
    const layersToPlace = [];
    for (let i = 0; i < amount; i++) {
      layersToPlace.push(
        <img
          key={`solarpanel ${i}`}
          src={layers[i].src}
          alt={layers[i].id}
          className={`absolute animate-appear-quick ${layers[i].top} ${layers[i].left} ${layers[i].width}`}
        ></img>
      );
    }
    return layersToPlace;
  };

  return (
    <div className="flex w-full flex-col">
      <h2 className="mx-8 text-lg">Zonnepanelen test</h2>
      <div className="flex flex-row">
        <div className="mx-8 flex w-1/3 flex-col">
          <p>Bepaal hier hoeveel zonnepanelen je op het dak van de flat plaatst. </p>
          <ImageSlider
            inputId="zonnepanelen_flat"
            value={zonnepanelen}
            min={0}
            max={6}
            step={1}
            label="Aantal zonnepanelen"
            updateLayers={updateLayers}
            type="range"
          ></ImageSlider>

          <div className="flex flex-row items-center justify-between gap-2">
            <label htmlFor="zonnepanelen_test_text" className="flex">
              Zonnepanelen
            </label>
            <input
              data-testid="2test"
              aria-label={`zonnepaneel_input`}
              id={`zonnepanelen_test_text`}
              type="number"
              onChange={(e) => updateLayers(e.target.value)}
              value={zonnepanelen}
              className={`w-16 rounded-sm border-2 border-holon-blue-900 bg-white p-1 text-right text-holon-blue-900 shadow-holon-blue placeholder:font-light placeholder:italic placeholder:text-holon-slated-blue-300 disabled:border-gray-500 disabled:text-slate-500 disabled:shadow-gray-500`}
              min="0"
              max="6"
            />
          </div>
        </div>
        <div className=" mx-8 flex w-2/3 flex-col">
          <div className="relative ">
            <img
              id="grond"
              src="/imgs/GROND_TEST_ZONDER_FLAT.png"
              className="relative top-[0] left-[0]"
              alt="grond"
            ></img>
            <img
              id="flat"
              src="/imgs/FLAT_TEST_ZONDER_ZONNENPANELEN.png"
              className="absolute top-[0] left-[0]"
              alt="grond"
            ></img>
            {placeLayers()}
          </div>
        </div>
      </div>
    </div>
  );
}
