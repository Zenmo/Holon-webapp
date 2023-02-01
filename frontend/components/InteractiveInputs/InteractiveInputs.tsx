import ImageSlider from "../InteractiveImage/ImageSlider";
import InteractiveInputPopover from "./InteractiveInputPopover";

export type Props = {
  contentId: string;
  name: string;
  type?: string;
  options: InteractiveInputOptions[];
  display?: string;
  defaultValue?: string | number;
  setValue: (id: string, value: number | string | boolean, optionId?: number) => void;
};

export type InteractiveInputOptions = {
  id: number;
  option?: string;
  default?: boolean;
  label?: string;
  legalLimitation?: string;
  color?: string;
  titleWikiPage?: string;
  linkWikiPage?: string;
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
            defaultChecked={inputItem.default}
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
            <span>{inputItem.label || inputItem.option}</span>
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
      ? "rounded-full after:checked:content-['●'] after:mt-[-2px]  flex-[0_0_20px]"
      : "rounded-none after:checked:content-['✔'] ";

  return (
    <div className="mb-4 font-bold text-base">
      <p>{name}</p>
      {options.map((inputItem, index) => (
        <div key={index} className="flex flex-row mb-2 gap-3 items-center">
          <label
            key={index}
            htmlFor={contentId + inputItem.id + "input"}
            className="flex flex-row mb-2 gap-4 items-center">
            <input
              defaultChecked={inputItem.default ? true : false}
              type={inputType}
              name={name + contentId}
              id={contentId + inputItem.id + "input"}
              data-testid={name + inputItem.id}
              onChange={e => setValue(contentId, e.target.checked, inputItem.id)}
              // checked={}
              className={`${cssClass} flex h-5 w-5 min-w-[1.25rem] appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500`}
            />
            <span className="">{inputItem.label || inputItem.option}</span>
          </label>
          {inputItem.legalLimitation || inputItem.linkWikiPage ? (
            <InteractiveInputPopover
              name={inputItem.label || inputItem.option}
              legal_limitation={inputItem.legalLimitation}
              color={inputItem.color}
              titleWikiPage={inputItem.titleWikiPage}
              linkWikiPage={inputItem.linkWikiPage}></InteractiveInputPopover>
          ) : (
            ""
          )}

          {inputItem.color !== "no-color" && (
            <div
              className="rounded-full w-2 h-2 min-w-[0.5rem]"
              style={{ backgroundColor: inputItem.color }}></div>
          )}
        </div>
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
  defaultValue,
  setValue,
}: Props) {
  return type === "continuous" ? (
    <ImageSlider
      inputId={contentId}
      datatestid={name}
      defaultValue={Number(defaultValue)}
      setValue={setValue}
      min={options[0].sliderValueMin}
      max={options[0].sliderValueMax}
      step={1}
      label={name}
      type="range"
      unit="%"
      tooltip={true}
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
