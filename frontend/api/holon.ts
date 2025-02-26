import { httpGet } from "@/utils/Http"
import * as Cookies from "es-cookie"
import { postRequest } from "./wagtail"

const NEXT_PUBLIC_WAGTAIL_API_URL = process.env.NEXT_PUBLIC_WAGTAIL_API_URL || "/wt/api/nextjs"

export type InteractiveElement = {
    interactiveElement: number
    value: number | string | string[] | number[]
}

export type SimulationInput = {
    interactiveElements: InteractiveElement[]
    scenario: number
    // to request specific simulation output
    anylogicOutputKeys: string[]
    // to request specific model input
    datamodelQueryRules: number[]
}

export type KPIQuad = {
    netload: number | null
    costs: number | null
    sustainability: number | null
    selfSufficiency: number | null
}

export enum Level {
    local = "local",
    intermediate = "intermediate",
    national = "national",
}

export const levels: Level[] = [Level.local, Level.intermediate, Level.national]

export type KPIsByScale = {
    [key in Level]: KPIQuad
}

export type SimulationResult = {
    dashboardResults: KPIsByScale
    costBenefitResults: Record<string, unknown>
    anylogicOutputs: Record<string, number>
    datamodelQueryResults: Record<number, number>
}

export async function getHolonKPIs(data: SimulationInput): Promise<SimulationResult> {
    const searchParams = new URLSearchParams()
    searchParams.append("caching", cachingDisabled() ? "false" : "true")

    const { json } = await postRequest(
        `${NEXT_PUBLIC_WAGTAIL_API_URL}/v2/holon/`,
        data,
        {
            headers: {
                "X-CSRFToken": Cookies.get("csrftoken"),
            },
        },
        searchParams,
    )

    return json
}

export async function cacheCheck(data: SimulationInput): Promise<boolean> {
    if (cachingDisabled()) {
        return false
    }

    const { json } = await postRequest(`${NEXT_PUBLIC_WAGTAIL_API_URL}/v2/cache_check/`, data, {
        headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
        },
    })

    return json.isCached
}

export async function getHolonDataSegments() {
    return await httpGet(`/api/dummy-kosten-baten`)
}

export async function getHolonDataSegmentsDetail() {
    return await httpGet(`/api/dummy-kosten-baten`)
}

const cachingDisabled = (): boolean =>
    window.location.search.toLowerCase().includes("caching=false")
