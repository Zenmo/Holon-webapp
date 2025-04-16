"use client"

import {FunctionComponent, useEffect, useRef} from "react"
import "services/anylogic-cloud-client-8.5.0"


interface Props {
    contentItem: {
        id: string
        type: string
        value: AnyLogicConnectionParams
    }
}

interface AnyLogicConnectionParams {
    cloudUrl: string
    modelId: string
    apiKey: string
}

export const AnyLogicEmbed: FunctionComponent<Props> = ({
    contentItem: {id, value}}
) => {
    const divId = `anylogic-${id}`

    useAnyLogic(divId, value)

    return <div id={divId} style={{
        aspectRatio: "8/5",
        maxHeight: "100vh",
        // anylogic uses absolute positioning.
        // this makes it relative to this parent element
        position: "relative",
    }} />
}

function useAnyLogic(divId: string, connectionParams: AnyLogicConnectionParams): void {
    const animationRef = useRef<AnyLogicCloudClient.Animation | null>(null)

    useEffect(() => {
        startSimulation(divId, connectionParams)
            .then(animation => {
                animationRef.current = animation
            })
        return function() {
            // clean up connection
            animationRef.current?.stop()
        }
    }, []);
}

async function startSimulation(divId: string, {apiKey, modelId, cloudUrl}: AnyLogicConnectionParams): Promise<AnyLogicCloudClient.Animation> {
    const cloudClient = CloudClient.create(apiKey, cloudUrl)
    const model = await cloudClient.getModelById(modelId)
    const latestVersion = await cloudClient.getModelVersionByNumber(model, model.modelVersions.length)
    const inputs = cloudClient.createDefaultInputs(latestVersion)
    const animation = await cloudClient.startAnimation(inputs, divId)

    return animation
}
