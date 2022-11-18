import React from "react";
import ImageSlider from "../InteractiveImage/ImageSlider";
import HolonButton from "../VersionOne/Buttons/HolonButton";
import s from "./InteractiveInputs.module.css";

type Props = {
  input: {
    id?: number;
    name?: string;
    type?: string;
    animationTag?: string;
    options: InteractiveInputOptions[];
  };
};
export type InteractiveInputOptions =
  | {
      id?: number;
      option: string;
    }
  | {
      slider_value_default?: number;
      slider_value_min?: number;
      slider_value_max?: number;
    };
function InteractiveRadios({ input }: Props) {
  return (
    <React.Fragment>
      {input.options.map((radio, index) => (
        <label
          key={index}
          htmlFor={input.name + radio.id}
          className="flex flex-row items-center gap-4">
          <input
            type="checkbox"
            name="heatholon"
            id={input.name + radio.id}
            data-testid={input.name + radio.id}
            onChange={() => console.log("onchange")}
            // checked={}
            className="flex h-5 w-5 appearance-none items-center justify-center rounded-none border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white shadow-[4px_4px_0_0] shadow-black checked:bg-holon-blue-500 after:checked:content-['✔'] disabled:border-holon-grey-300 disabled:shadow-gray-500 disabled:checked:bg-holon-grey-300"
          />
          <span className="mr-auto">{radio.option}</span>
        </label>
      ))}
    </React.Fragment>
  );
}
function InteractiveButtons({ input }: Props) {
  return (
    <React.Fragment>
      <div className="grid grid-cols-2 py-2 gap-2">
        {input.options.map((radio, index) => (
          <React.Fragment key={index}>
            <HolonButton variant="blue">{radio.option}</HolonButton>
          </React.Fragment>
        ))}
      </div>
    </React.Fragment>
  );
}

function InteractiveInputs({ input }: Props) {
  return (
    <React.Fragment>
      {input.type === "continuous" ? (
        <ImageSlider
          inputId={input.name}
          datatestid={input.name}
          value={input.options[0].slider_value_default}
          setValue={() => console.log("set value")}
          min={input.options[0].slider_value_min}
          max={input.options[0].slider_value_max}
          step={1}
          label={input.name}
          updateLayers={() => console.log("update layers")}
          type="range"
          locked={false}></ImageSlider>
      ) : input.type === "single_select" && input.display === "button" ? (
        <InteractiveButtons input={input} />
      ) : input.type === "single_select" && input.display === "checkbox_radio" ? (
        <InteractiveRadios input={input} />
      ) : (
        <p>Another one {input.name}</p>
      )}
    </React.Fragment>
  );
}

export default InteractiveInputs;
