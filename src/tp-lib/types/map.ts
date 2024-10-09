import { MarkerEvent } from "../map/marker-manager"
import {
    assertBoolean,
    assertEnum,
    assertNumber,
    assertObject,
    assertOptionalNumber,
    assertOptionalString,
    assertString,
    assertStringArray,
    isString,
} from "../tools/type-guards"
import { GeoPoint, MapFilter, MapTileSource } from "./types"
import { GeoBounds } from "./trace-data"

export function assertMarkerEvent(data: unknown): asserts data is MarkerEvent {
    assertObject(data, "MarkerEvent")
    const { id, lat, lng } = data
    assertNumber(id, "MarkerEvent.id")
    assertNumber(lat, "MarkerEvent.lat")
    assertNumber(lng, "MarkerEvent.lng")
}

export function isGeoPoint(data: unknown): data is GeoPoint {
    try {
        assertGeoPoint(data)
        return true
    } catch (ex) {
        return false
    }
}

export function assertGeoPoint(data: unknown): asserts data is GeoPoint {
    const prefix = "GeoPoint"
    assertObject(data, prefix)
    const { lat, lng } = data
    assertNumber(lat, `${prefix}.lat`)
    assertNumber(lng, `${prefix}.lng`)
}

export function assertMapFilter(data: unknown): asserts data is MapFilter {
    const prefix = "MapFilter"
    assertEnum(data, ["none", "gray", "sepia", "dark", "light", "blur"], prefix)
}

export function assertMapTileSource(
    data: unknown
): asserts data is MapTileSource {
    const prefix = "MapTileSource"
    assertObject(data, prefix)
    const {
        id,
        key,
        type,
        userAgent,
        conditions,
        name,
        urls,
        offline,
        maxZoom,
        bounds,
        attributions,
    } = data
    assertString(id, `${prefix}.id`)
    assertOptionalString(key, `${prefix}.key`)
    assertString(type, `${prefix}.type`)
    assertOptionalString(userAgent, `${prefix}.userAgent`)
    assertOptionalString(conditions, `${prefix}.conditions`)
    assertString(name, `${prefix}.name`)
    assertStringArray(urls, `${prefix}.urls`)
    assertBoolean(offline, `${prefix}.offline`)
    assertOptionalNumber(maxZoom, `${prefix}.maxZoom`)
    if (bounds) assertGeoBounds(bounds, `${prefix}.bounds`)
    if (isString(attributions)) return
    assertObject(attributions, `${prefix}.attributions`)
    for (const key of Object.keys(attributions)) {
        const attribution = attributions[key]
        assertObject(attribution, `${prefix}.attributions.${key}`)
        const { label, url } = attribution
        assertString(label, `${prefix}.attributions.${key}.label`)
        assertString(url, `${prefix}.attributions.${key}.url`)
    }
}

export function assertGeoBounds(
    data: unknown,
    prefix = "GeoBounds"
): asserts data is GeoBounds {
    assertObject(data, prefix)
    const { n, s, e, w } = data
    assertNumber(n, `${prefix}.n`)
    assertNumber(s, `${prefix}.s`)
    assertNumber(e, `${prefix}.e`)
    assertNumber(w, `${prefix}.w`)
}
