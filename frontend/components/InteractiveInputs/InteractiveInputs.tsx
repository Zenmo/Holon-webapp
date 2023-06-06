import ImageSlider from "../InteractiveImage/ImageSlider";
import InteractiveRadios from "./InteractiveRadios";

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
  targetValue?: string | number;
  targetValuePreviousSection?: string | number | [];
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
  discretizationSteps?: number;
  sliderUnit?: string;
  level?: string;
};

function InteractiveInputs({
  contentId,
  name,
  type,
  display,
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
    ? options.filter(option => option.level?.toLowerCase() == selectedLevel.toLowerCase())
    : options;

  //if there is a selectedlevel, it should match, the slider

  return type === "continuous" &&
    (!selectedLevel || selectedLevel.toLowerCase() == level?.toLowerCase()) ? (
    <ImageSlider
      inputId={contentId}
      datatestid={name}
      defaultValue={currentValue ? currentValue : defaultValue}
      setValue={setValue}
      min={options[0]?.sliderValueMin ? options[0].sliderValueMin : 0}
      max={options[0]?.sliderValueMax ? options[0].sliderValueMax : 100}
      unit={options[0]?.sliderUnit ? options[0].sliderUnit : "%"}
      step={options[0]?.discretizationSteps}
      label={name}
      type="range"
      moreInformation={moreInformation}
      titleWikiPage={titleWikiPage}
      linkWikiPage={linkWikiPage}
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
      display={display}
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
