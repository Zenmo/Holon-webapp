import { useEffect, useState } from "react";
import InteractiveInputPopover from "../InteractiveInputs/InteractiveInputPopover";
import styles from "./ImageSlider.module.css";

interface Props {
  locked?: boolean;
  inputId: string;
  datatestid: string;
  defaultValue?: number;
  setValue: (id: string, value: number) => void;
  label?: string;
  step?: number;
  min?: number;
  max?: number;
  type?: string;
  moreInformation?: string;
  titleWikiPage?: string;
  linkWikiPage?: string;
  tooltip?: boolean;
  unit?: string;
  selectedLevel?: string;
}

export default function ImageSlider({
  locked,
  inputId,
  datatestid,
  defaultValue,
  setValue,
  step,
  min,
  max,
  label,
  type,
  moreInformation,
  titleWikiPage,
  linkWikiPage,
  tooltip,
  unit,
  ticks,
  selectedLevel,
}: Props) {
  const [sliderValue, setSliderValue] = useState(defaultValue);
  const [realValue, setRealValue] = useState(defaultValue);
  const [sliderTooltipPosition, setSliderTooltipPosition] = useState(defaultValue);

  const slidermin = step ? 0 : min;
  const slidermax = step ? step - 1 : max;
  const sliderstep = 1;

  useEffect(() => {
    //set slider tooltip position based upon defaulvalue, maxvalue, minvalue
    //if minvalue == 10, maxvalue ==100, default == 55, then the sliderposition should be:
    // (55-10) / (100 / 10) == (50 percent)

    // because of the the Discretization steps, there are two values:
    // 1: slidervalue: this is value that is being used to position the slider. This is nessecary because a input type range can't handle fractions such as 1/3
    // 2: realvalue: this is the actual value, that is being used in the calculattions

    // if steps == 6 , the slider is a slider from 0 - 6.
    // the value of the slider is being transformed to an actual value, based upon the formula

    // (slidervalue - min) / (max-min) * slidermax
    // if the slider is value 3, the calculation is
    // (3-0) / (6-0) * 6 == 3

    setSliderTooltipPosition((defaultValue - min) / (max - min));
    setSliderValue(((defaultValue - min) / (max - min)) * slidermax);
  }, []);

  function updateSliderValue(inputId, slidervalue) {
    const actualValue = Math.round(((slidervalue / slidermax) * (max - min) + min) * 10) / 10;

    setSliderValue(slidervalue);
    setRealValue(actualValue);
    setSliderTooltipPosition(slidervalue / slidermax);

    setValue(inputId, actualValue);
  }

  return (
    <div className="my-4 flex flex-col">
      <div className="flex flex-row mb-2 gap-3 items-center">
        <label
          htmlFor={inputId + (selectedLevel ? "holarchy" : "storyline")}
          className="flex text-base font-bold">
          {label}
        </label>
        {/* if selectedLevel, then you are in the holarchy view and popover is not shown */}
        {!selectedLevel && (moreInformation || linkWikiPage) ? (
          <InteractiveInputPopover
            name={label}
            moreInformation={moreInformation}
            titleWikiPage={titleWikiPage}
            linkWikiPage={linkWikiPage}></InteractiveInputPopover>
        ) : (
          ""
        )}
      </div>

      <div className={`flex flex-row ${tooltip && `pt-8`}`}>
        <div className="flex flex-row relative items-center flex-1 h-[24px]">
          <input
            data-testid={datatestid}
            disabled={locked}
            value={sliderValue}
            onChange={e => {
              updateSliderValue(inputId, Number(e.target.value));
            }}
            className={`h-1 w-3/5 ${locked ? "cursor-not-allowed" : ""} ${
              styles.slider
            } interactImg appearance-none disabled:bg-holon-grey-300`}
            step={sliderstep}
            min={slidermin}
            max={slidermax}
            type={type}
            id={inputId + (selectedLevel ? "holarchy" : "storyline")}
          />
          {tooltip && (
            <div className={styles.slidervalue}>
              <div className="relative z-10">
                <output
                  className="text-white border-white rounded"
                  style={{ left: "calc((" + sliderTooltipPosition + ") * 100%)" }}>
                  {realValue}
                </output>
              </div>
            </div>
          )}
          {/* when therer ar more then 12 ticks, hide the ticks because it looks ugly */}
          {ticks > 0 && ticks < 12 && (
            <div className="absolute pointer-events-none w-[calc(100%-19px)] flex justify-between flex-row ml-[9px] z-[0] items-center-center">
              <span className="flex-[0_0_4px] h-[5px] bg-white opacity-0"></span>
              {[...Array(parseInt(slidermax))].map((x, i) => (
                <span
                  key={i}
                  className={
                    "flex-[0_0_4px] h-[5px] bg-white " +
                    (i == parseInt(slidermax - 1) && "opacity-0")
                  }></span>
              ))}
            </div>
          )}
        </div>
        {unit && <span className="text-base ml-4">{unit}</span>}
      </div>
    </div>
  );
}
