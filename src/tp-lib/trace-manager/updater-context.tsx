import React from "react"
import TraceUpdater from "./updater"
import { TraceData } from "tp-lib/types"

export const TraceUpdaterContext = React.createContext<TraceUpdater | null>(
    null
)

export function useTraceUpdater(): TraceUpdater {
    const context = React.useContext(TraceUpdaterContext)
    if (context === null)
        throw Error("TraceUpdaterContext has not been initialized!")

    return context
}

export function useTraceUpdaterForKeys(
    ...keys: Array<keyof TraceData>
): TraceUpdater {
    const updater = useTraceUpdater()
    const [_counter, setCounter] = React.useState(0)
    React.useEffect(() => {
        const handler = (value: Partial<TraceData>) => {
            const updatedKeys = new Set(Object.keys(value))
            for (const key of keys) {
                if (updatedKeys.has(key)) {
                    setCounter((v) => v + 1)
                    return
                }
            }
        }
        updater.eventTraceChange.add(handler)
        return () => updater.eventTraceChange.remove(handler)
    }, [updater])
    return updater
}

export function useTraceUpdaterCanUndoRedo(): [
    canUndo: boolean,
    canRedo: boolean,
] {
    const updater = useTraceUpdater()
    const [can, setCan] = React.useState<[boolean, boolean]>([
        updater.canUndo,
        updater.canRedo,
    ])
    React.useEffect(() => {
        const handler = () => setCan([updater.canUndo, updater.canRedo])
        updater.eventUndoChange.add(handler)
        return () => updater.eventUndoChange.remove(handler)
    }, [updater])
    return can
}
