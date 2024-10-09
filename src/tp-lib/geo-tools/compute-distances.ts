import { computeDistance } from './compute-distance'

export function computeDistances(
    latitudes: number[],
    longitudes: number[],
    elevations: number[]=[]
): number[] {
    const size = Math.min(latitudes.length, longitudes.length)
    const distances = [0]
    let [lat1] = latitudes
    let [lng1] = longitudes
    let [ele1] = elevations
    let dis = 0
    for (let k = 1; k < size; k++) {
        const lat2 = latitudes[k]
        const lng2 = longitudes[k]
        const ele2 = elevations[k]
        dis += computeDistance(lat1, lng1, lat2, lng2)
        distances.push(dis)
        lat1 = lat2
        lng1 = lng2
        ele1 = ele2
    }
    return distances
}