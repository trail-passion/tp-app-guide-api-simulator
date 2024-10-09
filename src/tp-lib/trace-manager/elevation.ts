import { ensureNumber } from "../tools/type-guards"
import { TraceData } from "tp-lib/types"

const DEFAULT_ELEVATION_THRESHOLD = 15

export function commputeTraceElevationCumuls(
    trace: TraceData,
    from = 0,
    to = -1
): { asc: number[]; dsc: number[] } {
    const result: { asc: number[]; dsc: number[] } = {
        asc: [],
        dsc: [],
    }
    let a = from
    let b = to
    if (a < 0) a = 0
    if (b === -1) b = trace.alt.length - 1
    if (b >= trace.alt.length) b = trace.alt.length - 1
    if (a >= b) return result

    const threshold = Math.max(
        1,
        trace.elevationThreshold ?? DEFAULT_ELEVATION_THRESHOLD
    )
    let alt = trace.alt[a]
    let lastIdx = a
    let asc = 0
    let dsc = 0
    result.asc.push(0)
    result.dsc.push(0)
    for (let i = a + 1; i < b + 1; i++) {
        let cur = ensureNumber(trace.alt[i], -1)
        if (isNaN(cur) || cur < 0) {
            // If  a value  is NaN,  we must  ignore it  to preserve
            // computing correctness.
            result.asc.push(asc)
            result.dsc.push(dsc)
            continue
        }
        const delta = cur - alt
        let change = 0
        if (delta > threshold) {
            // Montée détectée.
            asc += delta
            alt = cur
            change = 1
        } else if (delta < -threshold) {
            // Descente détectée.
            dsc -= delta
            alt = cur
            change = -1
        }
        result.asc.push(asc)
        result.dsc.push(dsc)
        if (change > 0) {
            linearize(result.asc, lastIdx, i)
            lastIdx = i
        } else if (change < 0) {
            linearize(result.dsc, lastIdx, i)
            lastIdx = i
        }
    }
    return result
}

/**
 * Change the values of `arr` to make a line between `fromIndex` and `toIndex`.
 */
function linearize(arr: number[], fromIndex: number, toIndex: number) {
    if (toIndex - fromIndex < 2) return

    const val0 = arr[fromIndex]
    const val1 = arr[toIndex]
    const delta = val1 - val0
    const len = toIndex - fromIndex
    const coeff = delta / len
    for (let idx = 1; idx < len; idx++) {
        arr[idx + fromIndex] = val0 + coeff * idx
    }
}
