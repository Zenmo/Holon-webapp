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
  pagetype?: string;
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
  pagetype,
  setValue,
}: Props) {
  const visibleOptions = selectedLevel
    ? options.filter(option => option.level?.toLowerCase() == selectedLevel.toLowerCase())
    : options;

  //if there is a selectedlevel, it should match, the slider

  let slidermin = 0;
  let slidermax = 100;
  let sliderstep = null;
  if (pagetype !== "Sandbox") {
    slidermin = options[0]?.sliderValueMin ? options[0].sliderValueMin : 0;
    slidermax = options[0]?.sliderValueMax ? options[0].sliderValueMax : 100;
    sliderstep = options[0]?.discretizationSteps;
  }

  return type === "continuous" &&
    (!selectedLevel || selectedLevel.toLowerCase() == level?.toLowerCase()) ? (
    <ImageSlider
      inputId={contentId}
      datatestid={name}
      defaultValue={currentValue ? currentValue : defaultValue}
      setValue={setValue}
      min={slidermin}
      max={slidermax}
      unit={options[0]?.sliderUnit ? options[0].sliderUnit : "%"}
      step={sliderstep}
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
