import { useState, useEffect } from "react";
import ImgFlatSolar from "../InteractiveImage/ImageElements/ImgFlatSolar";
import ImageSlider from "../InteractiveImage/ImageSlider";

import type { Scenario, Slider } from "@/containers/StorylinePage/StorylinePage";
import { getHolonKPIs } from "@/api/holon";

type Props = {
  data: Scenario;
};

const SLIDER_DELAY_MILISECONDS = 1000;

export default function SolarpanelsAndWindmills({ data: scenario }: Props) {
  const [sliderValues, setSliderValues] = useState<{ slider: number; value: number }[]>([]);
  const [solarpanels, setSolarpanels] = useState<number>(0);
  const [solarpanelsProperties, setSolarpanelsProperties] = useState<Slider>({});
  const [windmills, setWindmills] = useState<number>(0);
  const [windmillsProperties, setWindmillsProperties] = useState<Slider>({});

  useEffect(() => {
    setScenarioData(scenario.value.content);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getHolonKPIs({
        scenario: 1,
        sliders: sliderValues,
      });
    }, SLIDER_DELAY_MILISECONDS);
    return () => clearTimeout(timeout);
  }, [sliderValues]);

  const updateSliderValues = (id: number, value: number) => {
    setSliderValues(
      sliderValues.map(slider => {
        if (slider.slider === id) {
          return {
            ...slider,
            value: value,
          };
        } else return slider;
      })
    );
  };

  const addSliderValue = (id: number, defaultValue: number = 0) => {
    if (sliderValues.find(slider => slider.slider === id)) return;

    setSliderValues([
      ...sliderValues,
      {
        slider: id,
        value: defaultValue,
      },
    ]);
  };

  const setScenarioData = (scenarios: Slider[]) => {
    scenarios.map((scenario: Slider) => {
      if (scenario.type === "slider") {
        switch (scenario.value.tag) {
          case "solar":
            setSolarpanelsProperties(scenario);
            addSliderValue(
              scenario.value.id,
              scenario?.value.sliderValueMin && scenario?.value.sliderValueDefault
            );
            break;
          case "windmills":
            setWindmillsProperties(scenario);
            addSliderValue(
              scenario.value.id,
              scenario?.value.sliderValueMin && scenario?.value.sliderValueDefault
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
          value={sliderValues.find(slider => slider.slider === 1)?.value}
          setValue={value => updateSliderValues(1, value)}
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
            value={sliderValues.find(slider => slider.slider === 2)?.value}
            setValue={value => updateSliderValues(2, value)}
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
        data-solarpanels={sliderValues[0]?.value}
        data-windmills={sliderValues[1]?.value}
        data-windforce={3}>
        <div className="storyline__row__image lg:sticky top-0 p-8">
          <ImgFlatSolar></ImgFlatSolar>
        </div>
      </div>
    </div>
  );
}
