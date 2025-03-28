import {SankeyLink} from "@/components/IJzerboeren/Sankey/link"
import {FunctionComponent} from "react"
import {IronPowderSankey} from "@/components/IJzerboeren/Sankey/dynamic-import"
import {NodeList} from "@/components/IJzerboeren/Sankey/node-list"

/**
 Wind + zon 100%
 ->  prcoes: elektrolyse, drager: waterstof, verlies 30%
 --> proces: regeneratie, drager: IJzerpoeder, verlies 50%
 ---> proces: verbranding, drager warmte: verlies 10%
 ----> proces: warmtenet transport, warmte: verlies 5%
 ------> uitkomst: warmte bij huizen
 */
function* linkGenerator(includeLoss: boolean): Generator<SankeyLink> {
    const electricityGeneration = 100
    yield {
        source: "Wind + zon",
        target: "Elektrolyse",
        value: electricityGeneration,
    }

    const [electrolysisOutput, electrolysisLoss] = ratio(electricityGeneration, .7)
    yield {
        source: "Elektrolyse",
        target: "Regeneratie",
        value: electrolysisOutput,
        label: "Waterstof",
    }
    if (includeLoss) {
        yield {
            source: "Elektrolyse",
            target: "Verlies",
            value: electrolysisLoss,
        }
    }

    const [regenerationOutput, regenerationLoss] = ratio(electrolysisOutput, .5)
    yield {
        source: "Regeneratie",
        target: "Verbranding",
        value: regenerationOutput,
        label: "IJzerpoeder",
    }
    if (includeLoss) {
        yield {
            source: "Regeneratie",
            target: "Verlies",
            value: regenerationLoss,
        }
    }

    const [burnOutput, burnLoss] = ratio(regenerationOutput, .9)
    yield {
        source: "Verbranding",
        target: "Warmtenet",
        value: burnOutput,
    }
    if (includeLoss) {
        yield {
            source: "Verbranding",
            target: "Verlies",
            value: burnLoss,
        }
    }

    const [districtHeatingOutput, districtHeatingLoss] = ratio(burnOutput, .95)
    yield {
        source: "Warmtenet",
        target: "Warmteafname huizen",
        value: districtHeatingOutput,
    }
    if (includeLoss) {
        yield {
            source: "Warmtenet",
            target: "Verlies",
            value: districtHeatingLoss,
        }
    }
}

const links = Array.from(linkGenerator(true))

export const IronPowderProcessSankey: FunctionComponent = () => (
    <IronPowderSankey
        links={links}
        nodes={NodeList.DEFAULT.update({
            name: "Regeneratie",
            x: .4,
            y: .3,
        }).update({
            name: "Verbranding",
            x: .6,
            y: .10,
        }).update({
            name: "Warmtenet",
            x: .8,
            y: .09,
        }).update({
            name: "Warmteafname huizen",
            x: 1,
            y: .15,
        }).update({
            name: "Verlies",
            x: 1,
            y: .7,
        }).toArray()}
        style={{
            maxWidth: "",
        }}
        plotlyLayout={{
            title: {
                text: "Energiestromen CO2-vrije ijzerpoederketen",
            },
        }}
        plotyData={{
            valuesuffix: "%",
        }}/>
)

function ratio(input: number, ratio: number): [number, number] {
    return [
        input * ratio,
        input * (1 - ratio),
    ]
}
