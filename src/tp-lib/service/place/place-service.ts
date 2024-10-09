import Service from "../service"
import { isArray, isObject } from "../../tools/type-guards"

export default {
    find,
    findNearest
}

export interface IPlace {
    lat: number
    lng: number
    name: string
    type: number
}

export interface IFindOptions {
    name?: string
    limit?: number
}

/**
 * Search a place by name, and return a list of matching ones.
 */
async function find(opts: IFindOptions): Promise<IPlace[]> {
    try {
        const result = await Service.exec('tp4.Places', {
            limit: 8,
            ...opts
        })
        const places: IPlace[] = []
        if (isPlaceProtocol(result)) {
            const { lat, lng, type, name } = result
            for (let index = 0; index < lat.length; index++) {
                places.push({
                    lat: lat[index],
                    lng: lng[index],
                    type: type[index],
                    name: name[index]
                })
            }
        } else {
            console.error("tp4.Places returned invalid data:", result)
        }
        return places
    }
    catch (ex) {
        console.error('Unable to find place by name!', ex)
        return []
    }
}

interface PlaceProtocol {
    lat: number[]
    lng: number[]
    type: number[]
    name: string[]
}

function isPlaceProtocol(data: unknown): data is PlaceProtocol {
    if (!isObject(data)) return false
    const {lat, lng, type, name}=data
    if (!isArray(lat))return false
    if (!isArray(lng))return false
    if (!isArray(type))return false
    if (!isArray(name))return false
    return true
}

/**
 * Search for the nearest place of a given location.
 */
async function findNearest(lat: number, lng: number): Promise<IPlace | null> {
    try {
        let LAT_RAD = 0.01
        let LNG_RAD = 0.01

        // We try three times to find a place. Each time we enlarge the search area.
        for (let tries = 0; tries < 3; tries++) {
            const result = await Service.exec(
                "tp4.Places", {
                N: lat + LAT_RAD,
                S: lat - LAT_RAD,
                E: lng + LNG_RAD,
                W: lng - LNG_RAD
            })
            // Enlarging the search area.
            LAT_RAD *= 10
            LNG_RAD *= 10

            if (!isPlaceList(result)) continue
            if (result.lat.length === 0) continue

            let bestDist = distance(lat, lng, result.lat[0], result.lng[0])
            let bestIndex = 0
            for (let index = 1; index < result.lat.length; index++) {
                const dist = distance(lat, lng, result.lat[index], result.lng[index])
                if (dist < bestDist) {
                    bestDist = dist
                    bestIndex = index
                }
            }

            return {
                lat: result.lat[bestIndex],
                lng: result.lng[bestIndex],
                name: result.name[bestIndex],
                type: result.type[bestIndex]
            }
        }
        return null
    }
    catch (ex) {
        console.error('Unable to find nearest place!', ex)
        return null
    }
}

function distance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const lat = lat1 - lat2
    const lng = lng1 - lng2

    return lat * lat + lng * lng
}

interface IPlaceList {
    lat: number[]
    lng: number[]
    name: string[]
    type: number[]
}

function isPlaceList(value: any): value is IPlaceList {
    if (!value) return false
    const { lat, lng, name, type } = value
    if (!Array.isArray(lat)) return false
    if (!Array.isArray(lng)) return false
    if (!Array.isArray(name)) return false
    if (!Array.isArray(type)) return false

    return true
}
