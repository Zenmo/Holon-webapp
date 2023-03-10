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
  defaultValue,
  currentValue,
  selectedLevel,
  level,
  setValue,
}: Props) {
  const visibleOptions = selectedLevel
    ? options.filter(option => option.level.toLowerCase() == selectedLevel.toLowerCase())
    : options;

  //if there is a selectedlevel, it should match, the slider
  return type === "continuous" &&
    (!selectedLevel || selectedLevel.toLowerCase() == level?.toLowerCase()) ? (
    <ImageSlider
      inputId={contentId}
      datatestid={name}
      defaultValue={currentValue ? currentValue : Number(defaultValue)}
      setValue={setValue}
      min={options[0]?.sliderValueMin ? options[0].sliderValueMin : 0}
      max={options[0]?.sliderValueMax ? options[0].sliderValueMax : 100}
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
  ) : visibleOptions.length ? (
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
  ) : (
    <></>
  );
}

export default InteractiveInputs;
