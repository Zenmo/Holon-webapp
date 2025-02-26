import ImageSlider from "../InteractiveImage/ImageSlider"
import InteractiveRadios from "./InteractiveRadios"

export type Props = {
    contentId: string
    name: string
    type?: string
    moreInformation?: string
    titleWikiPage?: string
    linkWikiPage?: string
    options: InteractiveInputOptions[]
    pagetype?: string
    display?: string
    defaultValue?: string | number | []
    currentValue?: string | number
    targetValue?: string | number
    targetValuePreviousSection?: string | number | []
    level?: string
    selectedLevel?: string
    setValue: (id: string, value: number | string | boolean, optionId?: number) => void
}

export type InteractiveInputOptions = {
    id: number
    option?: string
    default?: boolean
    label?: string
    legalLimitation?: string
    color?: string
    titleWikiPage?: string
    linkWikiPage?: string
    sliderValueDefault?: number
    sliderValueMax?: number
    sliderValueMin?: number
    discretizationSteps?: number
    sandboxDiscretizationSteps?: number
    sliderUnit?: string
    level?: string
}

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
    const visibleOptions =
        selectedLevel ?
            options.filter(option => option.level?.toLowerCase() == selectedLevel.toLowerCase())
        :   options

    //if there is a selectedlevel, it should match, the slider

    const slidermin = options[0]?.sliderValueMin ? options[0].sliderValueMin : 0
    const slidermax = options[0]?.sliderValueMax ? options[0].sliderValueMax : 100
    let sliderstep = null
    if (pagetype == "Sandbox") {
        sliderstep =
            options[0]?.sandboxDiscretizationSteps > 1 ?
                options[0]?.sandboxDiscretizationSteps
            :   slidermax - slidermin + 1 //force slider to either use discretizationSteps or steps of 1
    } else {
        sliderstep =
            options[0]?.discretizationSteps > 1 ?
                options[0]?.discretizationSteps
            :   slidermax - slidermin + 1 //force slider to either use discretizationSteps or steps of 1
    }

    return (
        (
            type === "continuous"
                && (!selectedLevel || selectedLevel.toLowerCase() == level?.toLowerCase())
        ) ?
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
                ticks={sliderstep}
                selectedLevel={selectedLevel}
                locked={false}
            ></ImageSlider>
        : visibleOptions.length ?
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
        :   <></>
    )
}

export default InteractiveInputs
