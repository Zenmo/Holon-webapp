import React from "react";
import ImageSlider from "../InteractiveImage/ImageSlider";

type Props = {
  input: {
    id?: number;
    name: string;
    type?: string;
    animationTag?: string;
    options: InteractiveInputOptions[];
    display: string;
  };
};
export type InteractiveInputOptions = {
  id: number;
  option?: string;
  slider_value_default?: number;
  slider_value_min?: number;
  slider_value_max?: number;
};
function InteractiveButtons({ input }: Props) {
  const inputType = input.type === "single_select" ? "radio" : "checkbox";
  const buttonLabelStyles =
    "flex h-full flex-row items-center justify-center peer-checked:bg-white peer-checked:text-blue-900 peer-checked:border-blue-900 border-white text-white bg-holon-blue-900 hover:bg-holon-blue-500 relative rounded border-2 px-4 py-3 text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50";

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {input.options.map((inputItem, index) => (
        <div key={index}>
          <input
            type={inputType}
            name={input.name}
            id={input.name + "" + inputItem.id}
            data-testid={input.name + inputItem.id}
            onChange={() => console.log("onchange")}
            // checked={}
            className="hidden peer"
          />
          <label key={index} htmlFor={input.name + "" + inputItem.id} className={buttonLabelStyles}>
            <span>{inputItem.option}</span>
          </label>
        </div>
      ))}
    </div>
  );
}
function InteractiveRadios({ input }: Props) {
  const inputType = input.type === "single_select" ? "radio" : "checkbox";
  const cssClass =
    input.type === "single_select"
      ? "rounded-full after:checked:content-['●']"
      : "rounded-none after:checked:content-['✔'] ";

  return (
    <div className="mb-4 font-bold text-base">
      {input.options.map((inputItem, index) => (
        <label
          key={index}
          htmlFor={input.name + inputItem.id + "input"}
          className="flex flex-row mb-2 gap-4 ">
          <input
            type={inputType}
            name={input.name}
            id={input.name + inputItem.id + "input"}
            data-testid={input.name + inputItem.id}
            onChange={() => console.log("onchange")}
            // checked={}
            className={`${cssClass} flex h-5 w-5 appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500`}
          />
          <span className="mr-auto">{inputItem.option}</span>
        </label>
      ))}
    </div>
  );
}

function InteractiveInputs({ input }: Props) {
  return input.type === "continuous" ? (
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
  ) : input.display === "checkbox_radio" ? (
    <InteractiveRadios input={input} />
  ) : input.display === "button" ? (
    <InteractiveButtons input={input} />
  ) : (
    <p>Another one {input.name}</p>
  );
}

export default InteractiveInputs;
