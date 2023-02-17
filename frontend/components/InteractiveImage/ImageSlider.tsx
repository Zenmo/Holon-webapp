import { useState } from "react";
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
  selectedLevel,
}: Props) {
  const [sliderValue, setSliderValue] = useState(defaultValue);
  return (
    <div className="my-4 flex flex-col">
      <div className="flex flex-row mb-2 gap-3 items-center">
        <label
          htmlFor={inputId + (selectedLevel ? "holarchy" : "storyline")}
          className="flex text-base font-bold">
          {label}
        </label>

        {moreInformation || linkWikiPage ? (
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
              setSliderValue(Number(e.target.value));
              setValue(inputId, Number(e.target.value));
            }}
            className={`h-1 w-3/5 ${locked ? "cursor-not-allowed" : ""} ${
              styles.slider
            } interactImg appearance-none disabled:bg-holon-grey-300`}
            step={step}
            min={min}
            max={max}
            type={type}
            id={inputId + (selectedLevel ? "holarchy" : "storyline")}
          />
          {tooltip && (
            <div className={styles.slidervalue}>
              <div className="relative">
                <output
                  className="text-white border-white rounded"
                  style={{ left: "calc((" + sliderValue + " /" + max + ") * 100%)" }}>
                  {sliderValue}
                </output>
              </div>
            </div>
          )}
        </div>
        {unit && <span className="text-base ml-4">{unit}</span>}
      </div>
    </div>
  );
}
