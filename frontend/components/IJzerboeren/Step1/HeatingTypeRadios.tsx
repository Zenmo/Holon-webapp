import { FunctionComponent } from "react"
import { HeatingType } from "@/components/IJzerboeren/Step1/step-1-data"
import InteractiveRadios from "@/components/InteractiveInputs/InteractiveRadios"
import { InteractiveInputOptions } from "@/components/InteractiveInputs/InteractiveInputs"

interface Props {
    heatingType?: HeatingType
    setHeatingType: (heatingType: HeatingType) => void
}

const options = [
    {
        id: 1111,
        option: HeatingType.GAS_BURNER,
        label: "Gasketel",
    },
    {
        id: 2222,
        option: HeatingType.HEAT_PUMP,
        label: "Warmtepomp",
    },
    {
        id: 3333,
        option: HeatingType.DISTRICT_HEATING,
        label: "Warmtenet",
    },
]

export const HeatingTypeRadios: FunctionComponent<Props> = ({ heatingType, setHeatingType }) => {
    return (
        <InteractiveRadios
            contentId="HeatingTypeRadios"
            name="Verwarmingssysteem"
            options={options}
            setValue={(contentId, checked, optionId) => {
                const option = options.find(o => o.id === optionId)
                setHeatingType(option.option)
            }}
            type="single_select"
            defaultValue={heatingType}
        />
    )
}
