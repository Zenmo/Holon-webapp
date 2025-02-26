import { initialSimulationState, useSimulation } from "@/services/use-simulation"
import { renderHook } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import { cacheCheck, getHolonKPIs } from "@/api/holon"

jest.mock("../api/holon", () => {
    const originalModule = jest.requireActual("../api/holon")

    const createMockPromise = () => {
        let resolve
        let reject
        const promise = new Promise((resolve2, reject2) => {
            resolve = resolve2
            reject = reject2
        })
        promise.resolve = resolve
        promise.reject = reject

        return promise
    }

    // Mock API calls so we can control the order of resolving/rejecting
    return {
        __esModule: true,
        ...originalModule,
        getHolonKPIs: jest.fn(createMockPromise),
        cacheCheck: jest.fn(createMockPromise),
    }
})

test("Simulation success flow", async () => {
    jest.clearAllMocks()
    const { result } = renderHook(useSimulation)
    expect(result.current.simulationState.loadingState).toBe("INITIAL")

    act(() => result.current.setDirty())
    expect(result.current.simulationState.loadingState).toBe("DIRTY")

    act(() => result.current.calculateKPIs({ interactiveElements: [], scenario: 1 }))
    expect(result.current.simulationState.loadingState).toBe("SENT")

    const ret = getHolonKPIs.mock.results[0].value
    await act(async () => {
        ret.resolve(12)
        return ret
    })

    expect(result.current.simulationState).toStrictEqual({
        loadingState: "DONE",
        previousResult: initialSimulationState.previousResult,
        simulationResult: 12,
    })
})

test("Simulation interrupted flow", async () => {
    jest.clearAllMocks()
    const { result } = renderHook(useSimulation)

    act(() => result.current.calculateKPIs({ interactiveElements: [], scenario: 1 }))
    act(() => result.current.calculateKPIs({ interactiveElements: [], scenario: 1 }))

    // This should all be ignored because this is the first call which is no longer relevant
    const ret1 = getHolonKPIs.mock.results[0].value
    await act(async () => {
        ret1.resolve(13)
        return ret1
    })

    expect(result.current.simulationState).toStrictEqual({
        loadingState: "SENT",
        previousResult: initialSimulationState.previousResult,
        simulationResult: initialSimulationState.simulationResult,
    })

    const ret2 = getHolonKPIs.mock.results[1].value
    await act(async () => {
        ret2.resolve(14)
        return ret2
    })

    expect(result.current.simulationState).toStrictEqual({
        loadingState: "DONE",
        previousResult: initialSimulationState.previousResult,
        simulationResult: 14,
    })
})

test("Simulation interrupted first call finishes last", async () => {
    jest.clearAllMocks()
    const { result } = renderHook(useSimulation)

    act(() => result.current.calculateKPIs({ interactiveElements: [], scenario: 1 }))
    act(() => result.current.calculateKPIs({ interactiveElements: [], scenario: 1 }))

    const ret2 = getHolonKPIs.mock.results[1].value
    await act(async () => {
        ret2.resolve(14)
        return ret2
    })

    expect(result.current.simulationState).toStrictEqual({
        loadingState: "DONE",
        previousResult: initialSimulationState.previousResult,
        simulationResult: 14,
    })

    // This should all be ignored because this is the first call which is no longer relevant
    const ret1 = getHolonKPIs.mock.results[0].value
    await act(async () => {
        ret1.resolve(13)
        return ret1
    })

    expect(result.current.simulationState).toStrictEqual({
        loadingState: "DONE",
        previousResult: initialSimulationState.previousResult,
        simulationResult: 14,
    })
})

test("Simulation not cached", async () => {
    jest.clearAllMocks()
    const { result } = renderHook(useSimulation)

    act(() => result.current.calculateKPIs({ interactiveElements: [], scenario: 1 }))

    const cacheCheckPromise = cacheCheck.mock.results[0].value
    await act(async () => {
        cacheCheckPromise.resolve(false)
        return cacheCheckPromise
    })

    expect(result.current.simulationState.loadingState).toBe("SIMULATING")

    const kpiPromise = getHolonKPIs.mock.results[0].value
    await act(async () => {
        kpiPromise.resolve(13)
        return kpiPromise
    })

    expect(result.current.simulationState).toStrictEqual({
        loadingState: "DONE",
        previousResult: initialSimulationState.previousResult,
        simulationResult: 13,
    })
})
