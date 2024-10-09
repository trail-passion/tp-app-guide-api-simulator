import {
    assertArray,
    assertObject,
    isArray,
    isNumber,
    isObject,
} from "../tools/type-guards"
import { TraceFile } from "../types/trace-file"
import { TraceData } from "../types/trace-data"
import { castToFloatOrUndef } from "../tools/caster"

export function isTraceFile(data: unknown): data is TraceFile {
    if (!isObject(data)) return false
    const { lat, lng } = data
    if (!isArray(lat)) return false
    if (!isArray(lng)) return false

    return true
}

export function assertTraceFile(data: unknown): asserts data is TraceFile {
    assertObject(data)
    const { lat, lng } = data
    assertArray(lat, "data.lat")
    assertArray(lng, "data.lng")
    const { asc, dsc, km } = data
    data.asc = castToFloatOrUndef(data.asc)
    data.dsc = castToFloatOrUndef(data.dsc)
    data.km = castToFloatOrUndef(data.km)
}

export function isTraceData(data: unknown): data is TraceData {
    if (!isObject(data)) return false
    const { lat, lng, alt, dis, acc, hrt, tim, level } = data
    if (!isArray(lat)) return false
    if (!isArray(lng)) return false
    if (!isArray(alt)) return false
    if (!isArray(dis)) return false
    if (!isArray(acc)) return false
    if (!isArray(hrt)) return false
    if (!isArray(tim)) return false
    if (!isNumber(level)) return false

    return true
}
