import { isNumber } from "../tools/type-guards"
import { TraceFile } from "../types/trace-file"

/**
 * Unzip traceFile in place and return it.
 */
export function unzipTrace(traceFile: TraceFile): TraceFile {
    const { zip } = traceFile
    if (!isNumber(zip) || zip === 0) return traceFile

    traceFile.lat = unzipArray(traceFile.lat, unzipCoord)
    traceFile.lng = unzipArray(traceFile.lng, unzipCoord)
    traceFile.alt = unzipArray(traceFile.alt)
    traceFile.dis = unzipArray(traceFile.dis)
    traceFile.tim = unzipArray(traceFile.tim)
    traceFile.hrt = unzipArray(traceFile.hrt)
    traceFile.acc = unzipArray(traceFile.acc)
    delete traceFile.zip
    return traceFile
}

/**
 * Zip traceFile in place and return it.
 */
export function zipTrace(traceFile: TraceFile): TraceFile {
    if (traceFile.zip === 1) return traceFile

    traceFile.lat = zipArray(traceFile.lat, zipCoord) ?? []
    traceFile.lng = zipArray(traceFile.lng, zipCoord) ?? []
    traceFile.alt = zipArray(traceFile.alt, Math.round)
    traceFile.dis = zipArray(traceFile.dis)
    traceFile.tim = zipArray(traceFile.tim)
    traceFile.hrt = zipArray(traceFile.hrt)
    traceFile.acc = zipArray(traceFile.acc)
    traceFile.zip = 1
    return traceFile
}

export function unzipArray(
    arr: number[] | undefined,
    mapFunction?: (item: number) => number
): number[] {
    if (!Array.isArray(arr) || arr.length === 0) return []

    const values: number[] = arr
    let [value] = values
    for (let k = 1; k < values.length; k++) {
        value += values[k]
        values[k] = value
    }
    if (mapFunction) {
        for (let k = 0; k < values.length; k++) {
            values[k] = mapFunction(values[k])
        }
    }
    return values
}

export function zipArray(
    arr?: number[],
    mapFunction?: (item: number) => number
): number[] {
    if (!Array.isArray(arr) || arr.length === 0) return []

    const values = [...arr]
    if (mapFunction) {
        for (let k = 0; k < values.length; k++) {
            values[k] = mapFunction(values[k])
        }
    }
    let [previousValue] = values
    for (let k = 1; k < values.length; k++) {
        const currentValue = values[k]
        values[k] = currentValue - previousValue
        previousValue = currentValue
    }
    return values
}

const UNZIP_COORD = 1e-6

export function unzipCoord(value: number): number {
    return value * UNZIP_COORD
}

const ZIP_COORD = 1e6

export function zipCoord(value: number): number {
    return Math.round(value * ZIP_COORD)
}
