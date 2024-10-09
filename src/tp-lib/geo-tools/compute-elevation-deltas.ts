export interface ElevationDeltas {
    asc: number[]
    dsc: number[]
}

export function computeElevationDeltas(
    altitudes: number[],
    threshold: number
): ElevationDeltas {
    const result: ElevationDeltas = { asc: [0], dsc: [0] }
    let [lastAltitude] = altitudes
    let asc = 0
    let dsc = 0
    for (let index = 1; index < altitudes.length; index++) {
        const altitude = altitudes[index]
        const delta = altitude - lastAltitude
        if (delta > threshold) {
            asc += delta
            lastAltitude = altitude
        } else if (-delta > threshold) {
            dsc -= delta
            lastAltitude = altitude
        }

        result.asc.push(Math.floor(0.5 + asc))
        result.dsc.push(Math.floor(0.5 + dsc))
    }
    return result
}

export function computeCumulatedElevations(
    altitudes: number[],
    threshold: number
): { asc: number; dsc: number } {
    const result = { asc: 0, dsc: 0 }
    let [lastAltitude] = altitudes
    for (let index = 1; index < altitudes.length; index++) {
        const altitude = altitudes[index]
        const delta = altitude - lastAltitude
        if (delta > threshold) {
            result.asc += delta
            lastAltitude = altitude
        } else if (-delta > threshold) {
            result.dsc -= delta
            lastAltitude = altitude
        }
    }
    result.asc = Math.round(result.asc)
    result.dsc = Math.round(result.dsc)
    return result
}
