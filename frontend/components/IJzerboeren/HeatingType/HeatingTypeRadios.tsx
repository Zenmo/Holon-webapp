import { FunctionComponent } from "react"
import InteractiveRadios from "@/components/InteractiveInputs/InteractiveRadios"
import {findSingle} from "@/utils/arrayFindSingle"
import {HeatingType} from "@/components/IJzerboeren/HeatingType/heating-type"

interface Props {
    heatingType?: HeatingType
    setHeatingType: (heatingType: HeatingType) => void
    options?: HeatingType[],
    // to prevent conflicts when rendering multiple times
    contentId?: string,
}

const inputOptions = [
    {
        id: 11,
        option: HeatingType.HEAT_PUMP,
        label: "Warmtepomp",
    },
    {
        id: 22,
        option: HeatingType.GAS_BURNER,
        label: "Gasketel",
    },
    {
        id: 33,
        option: HeatingType.DISTRICT_HEATING,
        label: "Warmtenet",
    },
    {
        id: 44,
        option: HeatingType.IRON_POWDER,
        label: "Warmtenet op ijzerpoeder",
    }
]

export const HeatingTypeRadios: FunctionComponent<Props> = ({
    heatingType,
    setHeatingType,
    options = Object.values(HeatingType),
    contentId = "HeatingTypeRadios"
}) => {
    return (
        <InteractiveRadios
            contentId={contentId}
            name="Verwarmingssysteem"
            options={inputOptions.filter(option => options.includes(option.option))}
            setValue={(contentId, checked, optionId) => {
                const option = findSingle(inputOptions, o => o.id === optionId)
                setHeatingType(option.option)
            }}
            type="single_select"
            defaultValue={heatingType}
        />
    )
}
