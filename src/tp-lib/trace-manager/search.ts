import distance from "../view/distance"
import { TraceData } from "tp-lib/types"

const NOT_FOUND = -1

export function findIndexFromDistance(
    trace: TraceData,
    distanceInMeters: number
): number {
    if (trace.dis.length === 0) return NOT_FOUND
    if (
        distanceInMeters < trace.dis[0] ||
        distanceInMeters > (trace.dis.at(-1) ?? 0)
    )
        return NOT_FOUND

    // Just a shortcut to the distances array.
    const D = trace.dis
    // Number of elements.
    const n = D.length
    // Lower bound of the search window.
    let a = 0
    // Higher bound of the search window.
    let b = n - 1
    while (b - a > 1) {
        const m = Math.floor(average(a, b))
        if (D[m] > distanceInMeters) {
            b = m
        } else {
            a = m
        }
    }

    if (distanceInMeters - D[a] < D[b] - distanceInMeters) return a
    return b
}

function average(a: number, b: number) {
    return (a + b) * 0.5
}
