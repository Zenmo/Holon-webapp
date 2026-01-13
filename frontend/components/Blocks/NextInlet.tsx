import {FunctionComponent} from "react"
import {Step1} from "@/components/IJzerboeren/Step1/Step1"
import {Step2} from "@/components/IJzerboeren/Step2/Step2"
import {Step3} from "@/components/IJzerboeren/Step3/Step3"
import {IronPowderProcessSankey} from "@/components/IJzerboeren/Sankey/IronPowderProcessSankey"
import {HattemEmbed} from "@/components/HattemEmbed"
import {BinnenhavenEmbed} from "@/components/BinnenhavenEmbed"

const inletComponents = new Map<string, FunctionComponent>([
    ["IJzerboerenStep1", Step1],
    ["IJzerboerenStep2", Step2],
    ["IJzerboerenStep3", Step3],
    ["IronPowderProcessSankey", IronPowderProcessSankey],
    ["HattemEmbed", HattemEmbed],
    ["BinnenhavenEmbed", BinnenhavenEmbed],
])

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
