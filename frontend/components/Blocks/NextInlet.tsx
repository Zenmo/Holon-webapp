import {FunctionComponent} from "react"
import {Step1} from "@/components/IJzerboeren/Step1/Step1"
import {Step2} from "@/components/IJzerboeren/Step2/Step2"
import {Step3} from "@/components/IJzerboeren/Step3/Step3"

const inletComponents = new Map<string, FunctionComponent>();
inletComponents.set("IJzerboerenStep1", Step1)
inletComponents.set("IJzerboerenStep2", Step2)
inletComponents.set("IJzerboerenStep3", Step3)

interface Props {
    contentItem: {
        id: string
        type: string
        value: {
            inlet: string
        }
    }
}

export const NextInletBlock: FunctionComponent<Props> = ({ contentItem: {value: {inlet}}}) => {
    const Component = inletComponents.get(inlet)

    if (!Component) {
        return <p style={{color: "red"}}>Can&apos;t find component {inlet}.</p>
    }

    return <Component/>
}
