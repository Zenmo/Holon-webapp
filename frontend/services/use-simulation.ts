import {cacheCheck, getHolonKPIs, KPIQuad, SimulationInput, SimulationResult} from "@/api/holon";
import {useRef, useState} from "react";

export type LoadingState =
    'INITIAL' |
    'SENT' | // Waiting for cache check and simulation result
    'SIMULATING' | // Cache check response indicated that the result is not in the cache. Waiting for simulation result.
    'DONE' | // Results are back and should be displayed
    'DIRTY';  // User has changed the inputs and the results are outdated

type UseSimulation = {
    simulationState: SimulationState
    setDirty(): void
    calculateKPIs(data: SimulationInput): void
}

type SimulationState = {
    loadingState: LoadingState
    simulationResult: SimulationResult
}

const initialQuad: KPIQuad = {
    netload: null,
    costs: null,
    sustainability: null,
    selfSufficiency: null,
}

export const initialSimulationState: SimulationState = {
    loadingState: 'INITIAL',
    simulationResult: {
        dashboardResults: {
            local: initialQuad,
            intermediate: initialQuad,
            national: initialQuad,
        },
        costBenefitResults: {},
    }
}

// Custom hook to keep logic out of component
export const useSimulation = (): UseSimulation => {
    const [simulationState, setSimulationState] = useState<SimulationState>(initialSimulationState)
    const simulationOrdinal = useRef(0)

    const setDirty = () => {
        ++simulationOrdinal.current
        setSimulationState({
          loadingState: 'DIRTY',
          simulationResult: initialSimulationState.simulationResult,
        })
    }

    const setSent = () => {
        setSimulationState({
          loadingState: 'SENT',
          simulationResult: initialSimulationState.simulationResult,
        })
    }

  const setSimulating = () => {
    setSimulationState({
      loadingState: 'SIMULATING',
      simulationResult: initialSimulationState.simulationResult,
    })
  }

    const calculateKPIs = (data: SimulationInput) => {
        setSent()
        const requestOrdinal = ++simulationOrdinal.current
        getHolonKPIs(data)
            .then((response) => {
                if (requestOrdinal != simulationOrdinal.current) {
                    return
                }

                // increment so that any cache check response that comes in after this is ignored
                ++simulationOrdinal.current

                setSimulationState({
                    loadingState: 'DONE',
                    simulationResult: response,
                })
            })

        cacheCheck(data)
            .then(isCached => {
                if (requestOrdinal !== simulationOrdinal.current) {
                    return
                }

                if (!isCached) {
                  setSimulating()
                }
            })
    }


    return {
        simulationState,
        calculateKPIs,
        setDirty,
    }
}
