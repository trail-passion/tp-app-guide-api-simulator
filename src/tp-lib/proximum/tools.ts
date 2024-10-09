import { ITrace, IBounds } from "tp-lib/types"

const MAX_LEVEL = 8

export default {
    addMarginsToBounds,
    createNode,
    getSegmentsOfTrace,
}

export interface IProximumSegment {
    idx0: number
    lat0: number
    lng0: number
    lat1: number
    lng1: number
    // Normal vector from point 0 to point 1.
    vecLat: number
    vecLng: number
    // Distance between points 0 and 1.
    len: number
}

export interface IProximumNodePure {
    center: {
        lat: number
        lng: number
    }
    childNE: IProximumNode
    childNW: IProximumNode
    childSE: IProximumNode
    childSW: IProximumNode
}

export interface IProximumNodeLeave {
    segments: IProximumSegment[]
}

export type IProximumNode = IProximumNodePure | IProximumNodeLeave

/**
 * Enlarge the bounds of 10%.
 */
function addMarginsToBounds(bounds: IBounds, percent: number = 10): IBounds {
    const marginLat = (bounds.n - bounds.s) * percent * 0.01
    const marginLng = (bounds.e - bounds.w) * percent * 0.01
    bounds.n += marginLat
    bounds.s -= marginLat
    bounds.e += marginLng
    bounds.w -= marginLng
    return bounds
}

function createNode(
    bounds: IBounds,
    segments: IProximumSegment[],
    level = 0
): IProximumNode {
    if (level > MAX_LEVEL - 2 || segments.length === 0) {
        return { segments }
    }

    const center = computeCenter(bounds)
    const { n, s, e, w } = bounds
    const boundsNE = { n, e, s: center.lat, w: center.lng }
    const boundsNW = { n, w, s: center.lat, e: center.lng }
    const boundsSE = { s, e, n: center.lat, w: center.lng }
    const boundsSW = { s, w, n: center.lat, e: center.lng }
    return {
        center,
        childNE: createNode(
            boundsNE,
            segments.filter(isSegmentInBounds(boundsNE)),
            level + 1
        ),
        childNW: createNode(
            boundsNW,
            segments.filter(isSegmentInBounds(boundsNW)),
            level + 1
        ),
        childSE: createNode(
            boundsSE,
            segments.filter(isSegmentInBounds(boundsSE)),
            level + 1
        ),
        childSW: createNode(
            boundsSW,
            segments.filter(isSegmentInBounds(boundsSW)),
            level + 1
        ),
    }
}

export function isSegmentInBounds(bounds: IBounds) {
    const latRadius = 0.001
    const lngRadius = 0.001
    const N = bounds.n + latRadius
    const S = bounds.s - latRadius
    const E = bounds.e + lngRadius
    const W = bounds.w - lngRadius

    return (segment: IProximumSegment) => {
        const { lat0, lng0, lat1, lng1 } = segment
        if (lat0 > N && lat1 > N) return false
        if (lat0 < S && lat1 < S) return false
        if (lng0 > E && lng1 > E) return false
        if (lng0 < W && lng1 < W) return false
        return true
    }
}
/**
 * Compute center of bounds.
 */
function computeCenter(bounds: IBounds): { lat: number; lng: number } {
    return {
        lat: (bounds.n + bounds.s) * 0.5,
        lng: (bounds.e + bounds.w) * 0.5,
    }
}

/**
 * Return an array of segments from a trace.
 */
function getSegmentsOfTrace(trace: ITrace): IProximumSegment[] {
    const segments: IProximumSegment[] = []
    for (let k = 0; k < trace.lat.length - 1; k++) {
        const lat0 = trace.lat[k]
        const lng0 = trace.lng[k]
        const lat1 = trace.lat[k + 1]
        const lng1 = trace.lng[k + 1]
        let vecLat = lat1 - lat0
        let vecLng = lng1 - lng0
        const len = Math.sqrt(vecLat * vecLat + vecLng * vecLng)
        if (len > 0) {
            vecLat /= len
            vecLng /= len
        }
        segments.push({
            idx0: k,
            lat0,
            lng0,
            lat1,
            lng1,
            vecLat,
            vecLng,
            len,
        })
    }
    return segments
}
