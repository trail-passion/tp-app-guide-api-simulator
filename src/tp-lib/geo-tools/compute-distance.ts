import { EQUTORIAL_RADIUS, POLAR_RADIUS, RADIANS_PER_DEGREE } from '../constants'

export function computeDistance(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number,
    elevation1: number = 0,
    elevation2: number = 0
): number {
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