import {
    EQUTORIAL_RADIUS,
    POLAR_RADIUS,
    RADIANS_PER_DEGREE,
} from "./../constants"
import { GeoPoint, GeoPointWithAltitude, GeoPoints } from "tp-lib/types"

export function computeTraceLengthInMeters(trace: GeoPoints): number {
    let distance = 0
    let [lat0] = trace.lat
    let [lng0] = trace.lng
    const point0 = { lat: lat0, lng: lng0 }
    for (let i = 1; i < trace.lat.length; i++) {
        const lat = trace.lat[i]
        const lng = trace.lng[i]
        distance += computeDistance(point0, { lat, lng })
        point0.lat = lat
        point0.lng = lng
    }
    return distance
}

export function computeDistances(trace: GeoPoints): number[] {
    const pointsCount = trace.lat.length
    if (pointsCount === 0) return []
    if (pointsCount === 1) return [0]
    const dis: number[] = [0]
    let totalDis = 0
    let previousPoint = getPointWithAltitude(trace, 0)
    for (let index = 1; index < pointsCount; index++) {
        const currentPoint = getPointWithAltitude(trace, index)
        totalDis += computeDistanceWithAltitude(currentPoint, previousPoint)
        dis.push(totalDis)
        previousPoint = currentPoint
    }
    return dis
}

export function computeDistance(point1: GeoPoint, point2: GeoPoint): number {
    return computeDistanceWithAltitude(
        {
            alt: 0,
            ...point1,
        },
        {
            alt: 0,
            ...point2,
        }
    )
}

export function computeDistanceWithAltitude(
    point1: GeoPointWithAltitude,
    point2: GeoPointWithAltitude
): number {
    const { lat: latitude1, lng: longitude1, alt: elevation1 } = point1
    const { lat: latitude2, lng: longitude2, alt: elevation2 } = point2
    const lat1rad = latitude1 * RADIANS_PER_DEGREE
    const lng1rad = longitude1 * RADIANS_PER_DEGREE
    const lat2rad = latitude2 * RADIANS_PER_DEGREE
    const lng2rad = longitude2 * RADIANS_PER_DEGREE

    const r1 = (EQUTORIAL_RADIUS + elevation1) * Math.cos(lat1rad)
    const z1 = (POLAR_RADIUS + elevation1) * Math.sin(lat1rad)
    const x1 = r1 * Math.cos(lng1rad)
    const y1 = r1 * Math.sin(lng1rad)
    const r2 = (EQUTORIAL_RADIUS + elevation2) * Math.cos(lat2rad)
    const z2 = (POLAR_RADIUS + elevation2) * Math.sin(lat2rad)
    const x2 = r2 * Math.cos(lng2rad)
    const y2 = r2 * Math.sin(lng2rad)

    const x = x1 - x2
    const y = y1 - y2
    const z = z1 - z2

    return Math.sqrt(x * x + y * y + z * z)
}

function getPointWithAltitude(
    trace: GeoPoints,
    index: number
): GeoPointWithAltitude {
    return {
        lat: trace.lat[index] ?? 0,
        lng: trace.lng[index] ?? 0,
        alt: trace.alt ? (trace.alt[index] ?? 0) : 0,
    }
}

export function findIndexOfDistance(
    { dis: arr }: { dis: number[] },
    distance: number
) {
    if (arr.length < 2) return 0
    let a = 0
    let b = arr.length - 1
    while (b - a > 1) {
        const m = (a + b) >> 1
        const disM = arr[m]
        if (distance < disM) b = m
        else a = m
    }
    const disA = Math.abs(arr[a] - distance)
    const disB = Math.abs(arr[b] - distance)
    return disA < disB ? a : b
}
