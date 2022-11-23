import ImageSlider from "../InteractiveImage/ImageSlider";

export type Props = {
  contentId: string;
  name: string;
  type?: string;
  options: InteractiveInputOptions[];
  display?: string;
  defaultValueOverride?: string;
  setValue: (id: string, value: number | string | boolean, optionId?: number) => void;
};

export type InteractiveInputOptions = {
  id: number;
  option?: string;
  default?: boolean;
  sliderValueDefault?: number;
  sliderValueMax?: number;
  sliderValueMin?: number;
};
function InteractiveButtons({ contentId, name, type, options, setValue }: Props) {
  const inputType = type === "single_select" ? "radio" : "checkbox";

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {options.map((inputItem, index) => (
        <div key={index}>
          <input
            type={inputType}
            name={name}
            id={contentId + "" + inputItem.id}
            data-testid={name + inputItem.id}
            onChange={e => setValue(contentId, e.target.checked, inputItem.id)}
            // checked={}
            className="hidden peer"
          />
          <label
            key={index}
            htmlFor={contentId + "" + inputItem.id}
            className="flex h-full flex-row items-center justify-center peer-checked:bg-white peer-checked:text-blue-900 peer-checked:border-blue-900 border-white text-white bg-holon-blue-900 hover:bg-holon-blue-500 relative rounded border-2 px-4 py-3 text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50">
            <span>{inputItem.option}</span>
          </label>
        </div>
      ))}
    </div>
  );
}
function InteractiveRadios({ contentId, name, type, options, setValue }: Props) {
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
          htmlFor={contentId + inputItem.id + "input"}
          className="flex flex-row mb-2 gap-4 ">
          <input
            defaultChecked={inputItem.default ? true : false}
            type={inputType}
            name={name + contentId}
            id={contentId + inputItem.id + "input"}
            data-testid={name + inputItem.id}
            onChange={e => setValue(contentId, e.target.checked, inputItem.id)}
            // checked={}
            className={`${cssClass} flex h-5 w-5 appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500`}
          />
          <span className="mr-auto">{inputItem.option}</span>
        </label>
      ))}
    </div>
  );
}

function InteractiveInputs({
  contentId,
  name,
  type,
  options,
  display,
  defaultValueOverride,
  setValue,
}: Props) {
  return type === "continuous" ? (
    <ImageSlider
      inputId={contentId}
      datatestid={name}
      defaultvalue={
        defaultValueOverride ? parseInt(defaultValueOverride) : options[0].sliderValueDefault
      }
      setValue={setValue}
      min={options[0].sliderValueMin}
      max={options[0].sliderValueMax}
      step={1}
      label={name}
      type="range"
      locked={false}></ImageSlider>
  ) : display === "checkbox_radio" ? (
    <InteractiveRadios
      setValue={setValue}
      contentId={contentId}
      name={name}
      type={type}
      options={options}
    />
  ) : display === "button" ? (
    <InteractiveButtons
      setValue={setValue}
      contentId={contentId}
      name={name}
      type={type}
      options={options}
    />
  ) : (
    <p>Another one {name}</p>
  );
}

export default InteractiveInputs;
