import { useState, useEffect } from "react";
import ImgFlatSolar from "../InteractiveImage/ImageElements/ImgFlatSolar";
import ImageSlider from "../InteractiveImage/ImageSlider";

import type { Scenario, Slider } from "@/containers/StorylinePage/StorylinePage";

type Props = {
  data: Scenario;
};

export default function SolarpanelsAndWindmills({ data: scenario }: Props) {
  const [solarpanels, setSolarpanels] = useState<number>(0);
  const [solarpanelsProperties, setSolarpanelsProperties] = useState<Slider>({});
  const [windmills, setWindmills] = useState<number>(0);
  const [windmillsProperties, setWindmillsProperties] = useState<Slider>({});

  useEffect(() => {
    setScenarioData(scenario.value.content);
  }, [scenario]);

  const setScenarioData = (scenarios: Slider[]) => {
    scenarios.map((scenario: Slider) => {
      if (scenario.type === "slider") {
        switch (scenario.value.tag) {
          case "solar":
            console.log(scenario);
            setSolarpanelsProperties(scenario);
            setSolarpanels(
              scenario?.value.sliderValueMin && scenario?.value.sliderValueDefault
                ? scenario?.value.sliderValueDefault
                : 0
            );
            break;
          case "windmills":
            setWindmillsProperties(scenario);
            setWindmills(
              scenario?.value.sliderValueMin && scenario?.value.sliderValueDefault
                ? scenario?.value.sliderValueDefault
                : 0
            );
            break;
          default:
            return null;
        }
      }
    });
  };

  function updateLayers(value: string, setValue: (newValue: number) => void) {
    const newValue: number = parseInt(value);
    setValue(newValue);
  }

  return (
    <div className="storyline__row flex flex-col lg:flex-row">
      <div className="flex flex-col p-8 lg:w-1/3 bg-slate-200">
        <ImageSlider
          inputId="zonnepanelen_flat"
          datatestid="zonnepanelen_flat"
          value={solarpanels}
          setValue={setSolarpanels}
          min={solarpanelsProperties.value?.sliderValueMin}
          max={solarpanelsProperties.value?.sliderValueMax}
          step={1}
          label="Aantal zonnepanelen"
          updateLayers={updateLayers}
          type="range"
          locked={solarpanelsProperties.value?.sliderLocked}></ImageSlider>

        {!isNaN(windmillsProperties.value?.sliderValueDefault) ? (
          <ImageSlider
            inputId="windmills_flat"
            datatestid="windmills_flat"
            value={windmills}
            setValue={setWindmills}
            min={windmillsProperties.value?.sliderValueMin}
            max={windmillsProperties.value?.sliderValueMax}
            step={1}
            label="Aantal windmolens"
            updateLayers={updateLayers}
            type="range"
            locked={windmillsProperties.value?.sliderLocked}></ImageSlider>
        ) : null}
        {/* <div>{windmills?.value.description}</div> */}
      </div>
      <div
        className="flex flex-col lg:w-2/3"
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
