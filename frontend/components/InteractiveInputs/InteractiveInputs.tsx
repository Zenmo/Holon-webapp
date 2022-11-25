import React from "react";
import { useState } from "react";
import ImageSlider from "../InteractiveImage/ImageSlider";

export type Props = {
  id: number;
  name: string;
  type?: string;
  options: InteractiveInputOptions[];
  display?: string;
};

export type InteractiveInputOptions = {
  id: number;
  option?: string;
  default?: boolean;
  sliderValueDefault?: number;
  sliderValueMax?: number;
  sliderValueMin?: number;
};
function InteractiveButtons({ id, name, type, options }: Props) {
  const inputType = type === "single_select" ? "radio" : "checkbox";

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {options.map((inputItem, index) => (
        <div key={index}>
          <input
            type={inputType}
            name={name}
            id={id + "" + inputItem.id}
            data-testid={name + inputItem.id}
            onChange={() => console.log("onchange")}
            // checked={}
            className="hidden peer"
          />
          <label
            key={index}
            htmlFor={id + "" + inputItem.id}
            className="flex h-full flex-row items-center justify-center peer-checked:bg-white peer-checked:text-blue-900 peer-checked:border-blue-900 border-white text-white bg-holon-blue-900 hover:bg-holon-blue-500 relative rounded border-2 px-4 py-3 text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50">
            <span>{inputItem.option}</span>
          </label>
        </div>
      ))}
    </div>
  );
}
function InteractiveRadios({ id, name, type, options }: Props) {
  const inputType = type === "single_select" ? "radio" : "checkbox";
  const cssClass =
    type === "single_select"
      ? "rounded-full after:checked:content-['●'] after:mt-[-2px]"
      : "rounded-none after:checked:content-['✔'] ";

  return (
    <div className="mb-4 font-bold text-base">
      {options.map((inputItem, index) => (
        <label
          key={index}
          htmlFor={id + inputItem.id + "input"}
          className="flex flex-row mb-2 gap-4 ">
          <input
            defaultChecked={inputItem.default ? true : false}
            type={inputType}
            name={name}
            id={id + inputItem.id + "input"}
            data-testid={name + inputItem.id}
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

function InteractiveInputs({ id, name, type, options, display }: Props) {
  const [inputvalue, setInputvalue] = useState(options[0].sliderValueDefault);

  function updateLayers(value: string, setInputvalue: (newValue: number) => void) {
    const newValue: number = parseInt(value);
    setInputvalue(newValue);
  }

  return type === "continuous" ? (
    <ImageSlider
      inputId={name}
      datatestid={name}
      value={inputvalue}
      setValue={setInputvalue}
      min={options[0].sliderValueMin}
      max={options[0].sliderValueMax}
      updateLayers={updateLayers}
      step={1}
      label={name}
      type="range"
      unit="%"
      tooltip={true}
      locked={false}></ImageSlider>
  ) : display === "checkbox_radio" ? (
    <InteractiveRadios id={id} name={name} type={type} options={options} />
  ) : display === "button" ? (
    <InteractiveButtons id={id} name={name} type={type} options={options} />
  ) : (
    <p>Another one {name}</p>
  );
}

export default InteractiveInputs;
