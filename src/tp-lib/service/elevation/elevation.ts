import Service from "../service"
import Zip from "../../trace-tools/zip"
import { ElevationDeltas } from "../../geo-tools/compute-elevation-deltas"
import { isArray, isNumber, isObject } from "../../tools/type-guards"

const globalCache = new Map<string, number>()

export default {
    async get(latitudes: number[], longitudes: number[]): Promise<number[]> {
        const points: Array<[lat: number, lng: number]> = latitudes.map(
            (lat, idx) => [lat, longitudes[idx]]
        )
        const unknownPoints: Array<[lat: number, lng: number]> = points.filter(
            ([lat, lng]) => {
                const k = key(lat, lng)
                return !globalCache.has(k)
            }
        )

        // We can not ask more than 128 points at the time.
        // Otherwise we will get an error -6.
        const CHUNK = 128
        let cursor = 0
        while (cursor < unknownPoints.length) {
            const pointsToQuery = unknownPoints.slice(cursor, cursor + CHUNK)
            const params = {
                lat: Zip.zipLatitudes(pointsToQuery.map(([lat, _lng]) => lat)),
                lng: Zip.zipLongitudes(pointsToQuery.map(([_lat, lng]) => lng)),
            }
            cursor += CHUNK
            const result = await Service.exec("tp4.Elevation", params)
            if (isNumber(result)) {
                throw Error(`Unable to get altitudes: error #${result}!`)
            }
            if (!isElevationProtocol(result)) {
                console.error("tp4.Elevation returned invalid data:", result)
                throw Error(`Unable to get altitudes!`)
            }
            for (let index = 0; index < result.alt.length; index++) {
                const [lat, lng] = pointsToQuery[index]
                globalCache.set(key(lat, lng), result.alt[index])
            }
        }
        const elevations = points.map(([lat, lng]) => globalCache.get(key(lat, lng)) ?? -1)
        return elevations
    },
}

interface elevationProtocol {
    alt: number[]
}

function isElevationProtocol(data: unknown): data is elevationProtocol {
    if (!isObject(data)) return false
    const { alt } = data
    return isArray(alt)
}

function key(lat: Number, lng: number) {
    return `${lat.toFixed(6)}/${lng.toFixed(6)}`
}
