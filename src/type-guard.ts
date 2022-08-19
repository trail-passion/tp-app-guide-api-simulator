import { IGeoLocation } from "@/types"
import { isNumber, isObject, isString } from "tp-lib/tools/type-guards"

export function isGeoLocation(data: unknown): data is IGeoLocation {
    if (!isObject(data)) return false
    const {
        status,
        lat,
        lng,
        alt,
        speed,
        accuracy,
        altitudeAccuracy,
        timestamp,
    } = data
    if (!isString(status)) return false
    if (!isNumber(lat)) return false
    if (!isNumber(lng)) return false
    if (!isNumber(alt)) return false
    if (!isNumber(speed)) return false
    if (!isNumber(accuracy)) return false
    if (!isNumber(altitudeAccuracy)) return false
    if (!isNumber(timestamp)) return false
    return true
}
