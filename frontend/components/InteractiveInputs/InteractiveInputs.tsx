import ImageSlider from "../InteractiveImage/ImageSlider";
import InteractiveInputPopover from "./InteractiveInputPopover";

export type Props = {
  contentId: string;
  name: string;
  type?: string;
  moreInformation?: string;
  titleWikiPage?: string;
  linkWikiPage?: string;
  options: InteractiveInputOptions[];
  display?: string;
  defaultValue?: string | number | [];
  currentValue?: string | number;
  level?: string;
  selectedLevel?: string;
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
  level?: string;
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
function InteractiveRadios({
  contentId,
  name,
  type,
  moreInformation,
  titleWikiPage,
  linkWikiPage,
  options,
  selectedLevel,
  setValue,
  defaultValue,
}: Props) {
  const inputType = type === "single_select" ? "radio" : "checkbox";
  const cssClass =
    type === "single_select"
      ? "rounded-full after:checked:content-['●'] after:mt-[-2px]  flex-[0_0_20px]"
      : "rounded-none after:checked:content-['✔'] ";

  const defaultCheckedValue = type === "single_select" ? [defaultValue] : defaultValue;

  return (
    <div className="mb-4 font-bold text-base">
      <div className="flex flex-row mb-2 gap-3 items-center">
        <p>{name}</p>
        {/* if selectedLevel, then you are in the holarchy view and popover is not shown */}
        {!selectedLevel && (moreInformation || linkWikiPage) ? (
          <InteractiveInputPopover
            name={name}
            moreInformation={moreInformation}
            titleWikiPage={titleWikiPage}
            linkWikiPage={linkWikiPage}></InteractiveInputPopover>
        ) : (
          ""
        )}
      </div>
      {options.map((inputItem, index) => (
        <div key={index} className="flex flex-row mb-2 gap-3 items-center">
          <label
            key={index}
            htmlFor={
              contentId + inputItem.id + (selectedLevel ? "holarchy" : "storyline") + "input"
            }
            className="flex flex-row mb-2 gap-4 items-center">
            <input
              defaultChecked={defaultCheckedValue.includes(inputItem.option)}
              type={inputType}
              name={name + contentId}
              id={contentId + inputItem.id + (selectedLevel ? "holarchy" : "storyline") + "input"}
              data-testid={name + inputItem.id}
              onChange={e => setValue(contentId, e.target.checked, inputItem.id)}
              // checked={}
              className={`${cssClass} flex h-5 w-5 min-w-[1.25rem] appearance-none items-center justify-center border-2 border-holon-blue-900 from-inherit bg-center py-2 text-white checked:bg-holon-blue-500`}
            />
            <span className="">{inputItem.label || inputItem.option}</span>
          </label>
          {/* if selectedLevel, then you are in the holarchy view and popover is not shown */}
          {!selectedLevel && (inputItem.legalLimitation || inputItem.linkWikiPage) ? (
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
  moreInformation,
  titleWikiPage,
  linkWikiPage,
  options,
  display,
  defaultValue,
  currentValue,
  selectedLevel,
  level,
  setValue,
}: Props) {
  const visibleOptions = selectedLevel
    ? options.filter(option => option.level == selectedLevel)
    : options;

  //if there is a selectedlevel, it should match, the slider,
  //for interactive radios and interactive buttons, the sepeartion is done in InteractiveRadios and  InteractiveButtons
  return type === "continuous" && (!selectedLevel || selectedLevel == level) ? (
    <ImageSlider
      inputId={contentId}
      datatestid={name}
      defaultValue={currentValue ? currentValue : Number(defaultValue)}
      setValue={setValue}
      min={options[0].sliderValueMin}
      max={options[0].sliderValueMax}
      step={1}
      label={name}
      type="range"
      moreInformation={moreInformation}
      titleWikiPage={titleWikiPage}
      linkWikiPage={linkWikiPage}
      unit="%"
      tooltip={true}
      selectedLevel={selectedLevel}
      locked={false}></ImageSlider>
  ) : display === "checkbox_radio" && visibleOptions.length ? (
    <InteractiveRadios
      setValue={setValue}
      defaultValue={currentValue ? currentValue : defaultValue}
      contentId={contentId}
      name={name}
      type={type}
      moreInformation={moreInformation}
      titleWikiPage={titleWikiPage}
      linkWikiPage={linkWikiPage}
      selectedLevel={selectedLevel}
      options={visibleOptions}
    />
  ) : display === "button" && visibleOptions.length ? (
    <InteractiveButtons
      setValue={setValue}
      contentId={contentId}
      name={name}
      type={type}
      options={visibleOptions}
    />
  ) : (
    <></>
  );
}

export default InteractiveInputs;
