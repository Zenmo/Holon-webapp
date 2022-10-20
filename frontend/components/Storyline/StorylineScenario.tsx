import { useState } from "react";
import ImgFlatSolar from "../InteractiveImage/ImageElements/ImgFlatSolar";
import ImageSlider from "../InteractiveImage/ImageSlider";
import RawHtml from "../RawHtml";
// //http://localhost:8000/wt/api/nextjs/v1/pages/8/
import exampledata from "./exampledata.json";

import { StorylineScenario as StorylineScenarioData } from "./types";

type Props = {
  storylineScenario: StorylineScenarioData;
};

export default function StorylineScenario({ storylineScenario: scenario }: Props) {
  console.log(scenario);
  const [solarpanels, setSolarpanels] = useState(
    scenario.value.solarpanels_min && scenario.value.solarpanels_default
      ? scenario.value.solarpanels_default
      : 0
  );
  const [windmills, setWindmills] = useState(
    scenario.value.windmills_default ? scenario.value.windmills_default : 0
  );

  function updateLayers(value: string, setValue: (newValue: number) => void) {
    const newValue: number = parseInt(value);
    setValue(newValue);
  }

  return (
    <div className="storyline__row flex flex-col lg:flex-row">
      <div className="flex flex-col p-8 lg:w-1/3">
        <h1>{scenario.value.title}</h1>

        <ImageSlider
          inputId="zonnepanelen_flat"
          datatestid="zonnepanelen_flat"
          value={solarpanels}
          setValue={setSolarpanels}
          min={scenario.value.windmills_min}
          max={scenario.value.windmills_max}
          step={1}
          label="Aantal zonnepanelen"
          updateLayers={updateLayers}
          type="range"
          locked={scenario.value.windmills_locked}></ImageSlider>

        {scenario.value.windmills_default && (
          <ImageSlider
            inputId="windmills_flat"
            datatestid="windmills_flat"
            value={windmills}
            setValue={setWindmills}
            min={scenario.value.windmills_min}
            max={scenario.value.windmills_max}
            step={1}
            label="Aantal windmolens"
            updateLayers={updateLayers}
            type="range"
            locked={scenario.value.windmills_locked}></ImageSlider>
        )}
        <div>
          <RawHtml html={scenario.value.description} />
        </div>
      </div>
      <div
        className="flex flex-col lg:w-2/3 "
        data-solarpanels={solarpanels}
        data-windmills={windmills}
        data-windforce={3}>
        <div className="storyline__row__image lg:sticky top-0 p-8">
          <ImgFlatSolar></ImgFlatSolar>
        </div>
      </div>
    </div>
  );
}
