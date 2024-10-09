import { IBounds, IGeoPoint } from "tp-lib/types"

export default {
    boundsIntersect,
    ensureInRange,
    ensureLatInRange,
    ensureLngInRange,
    isInBounds,
}

function ensureLatInRange(lat: number) {
    return ensureInRange(lat, -90, 90)
}

function ensureLngInRange(lat: number) {
    return ensureInRange(lat, -180, 180)
}

/**
 * Ensure `value` is grater or equal to `min`
 * and lower or equal to `max`.
 */
function ensureInRange(value: number, min: number, max: number) {
    if (min === max) return min

    if (min >= max) throw `"min" must be lower than "max"!`

    if (value < min) {
        const size = max - min

        return value + Math.ceil((min - value) / size) * size
    }

    if (value > max) {
        const size = max - min

        return value - Math.ceil((value - max) / size) * size
    }

    return value
}

function isInBounds(point: IGeoPoint, bounds: IBounds): boolean {
    const { lat, lng } = point
    if (lat < bounds.s || lat > bounds.n) return false
    if (lng < bounds.w || lng > bounds.e) return false

    return true
}

/**
 * Check if two bounds have an intersection or not.
 */
function boundsIntersect(bounds1: IBounds, bounds2: IBounds): boolean {
    if (bounds1.n < bounds2.s) return false
    if (bounds2.n < bounds1.s) return false
    if (bounds1.e < bounds2.w) return false
    if (bounds2.e < bounds1.w) return false

    return true
}
