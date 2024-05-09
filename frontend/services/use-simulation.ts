import {cacheCheck, getHolonKPIs, KPIQuad, KPIsByScale, SimulationInput, SimulationResult} from "@/api/holon";
import {useRef, useState} from "react";

export type LoadingState =
    'INITIAL' |
    'SENT' | // Waiting for cache check and simulation result
    'SIMULATING' | // Cache check response indicated that the result is not in the cache. Waiting for simulation result.
    'DONE' | // Results are back and should be displayed
    'DIRTY' | // User has changed the inputs and the results are outdated
    'ERROR' ;

type UseSimulation = {
    simulationState: SimulationState
    setDirty(): void
    calculateKPIs(data: SimulationInput): void
}

export type SimulationState = {
    loadingState: LoadingState
    previousResult: SimulationResult
    simulationResult: SimulationResult
    error?: Error
}

const initialQuad: KPIQuad = {
    netload: null,
    costs: null,
    sustainability: null,
    selfSufficiency: null,
}

const initialKPIsByScale: KPIsByScale = {
    local: initialQuad,
    intermediate: initialQuad,
    national: initialQuad,
}

export const initialSimulationState: SimulationState = {
    loadingState: 'INITIAL',
    previousResult: {
        dashboardResults: initialKPIsByScale,
        costBenefitResults: {},
    },
    simulationResult: {
        dashboardResults: initialKPIsByScale,
        costBenefitResults: {},
    }
}

// Custom hook to keep logic out of component
export const useSimulation = (): UseSimulation => {
    const [simulationState, setSimulationState] = useState<SimulationState>(initialSimulationState)
    const simulationOrdinal = useRef(0)

    const setDirty = () => {
      ++simulationOrdinal.current

      setSimulationState(previousState => {
        if (previousState.simulationResult.dashboardResults.local.netload && (simulationState.loadingState === 'DONE' || simulationState.loadingState === 'INITIAL')) {
          return {
            ...previousState,
            loadingState: 'DIRTY',
            previousResult: previousState.simulationResult,
          }
        } else {
          return {
            ...previousState,
            loadingState: 'DIRTY',
            simulationResult: initialSimulationState.simulationResult,
          }
        }
      })
    }

    const setSent = () => {
      setSimulationState( previousState => ({
        ...previousState,
        loadingState: 'SENT',
        simulationResult: initialSimulationState.simulationResult,
      }))
    }

  const setSimulating = () => {
    setSimulationState(previousState => ({
      ...previousState,
      loadingState: 'SIMULATING',
      simulationResult: initialSimulationState.simulationResult,
    }))
  }

    const calculateKPIs = (data: SimulationInput) => {
        setDirty()
        setSent()
        const requestOrdinal = ++simulationOrdinal.current
        getHolonKPIs(data)
            .then((response) => {
                if (requestOrdinal != simulationOrdinal.current) {
                    return
                }
                // increment so that any cache check response that comes in after this is ignored
                simulationOrdinal.current += 1

                setSimulationState(previousState => ({
                    ...previousState,
                    loadingState: 'DONE',
                    simulationResult: response,
                }))
            }).catch(error => {
                if (requestOrdinal != simulationOrdinal.current) {
                  return
                }
                // increment so that any cache check response that comes in after this is ignored
                simulationOrdinal.current += 1

                setSimulationState(previousState => ({
                    ...previousState,
                    loadingState: 'ERROR',
                    simulationResult: initialSimulationState.simulationResult,
                    error: error,
                }))
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
