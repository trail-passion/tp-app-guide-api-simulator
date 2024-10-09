import TraceTools from "../trace-tools"
import { IBounds, IProximumPosition } from "tp-lib/types"
import Tools, {
    IProximumNode,
    IProximumNodeLeave,
    IProximumNodePure,
    IProximumSegment,
} from "./tools"

/**
 * A trace is made of segments. Proximum gives us a fast access to the nearest segment
 * to a given point (lat, lng).
 */
export default class Proximum {
    readonly root: IProximumNode
    readonly bounds: IBounds

    constructor(trace: { lat: number[]; lng: number[] }) {
        const bounds: IBounds = Tools.addMarginsToBounds(
            TraceTools.bounds(trace)
        )
        const segments: IProximumSegment[] = Tools.getSegmentsOfTrace(trace)
        this.root = Tools.createNode(bounds, segments)
        this.bounds = bounds
    }

    find(lat: number, lng: number): IProximumPosition | undefined {
        const segments = findSegments(lat, lng, this.root)

        let bestSquaredDist = Number.MAX_VALUE
        let bestLat = 0
        let bestLng = 0
        let bestSegment: IProximumSegment | undefined
        let bestAlpha = 0

        for (const seg of segments) {
            const alpha = clamp(
                dotProduct(
                    lat - seg.lat0,
                    lng - seg.lng0,
                    seg.vecLat,
                    seg.vecLng
                ),
                0,
                seg.len
            )
            // (projLat, projLng) is the projection of (lat, lng)
            // on the current segment.
            const projLat = seg.lat0 + alpha * seg.vecLat
            const projLng = seg.lng0 + alpha * seg.vecLng
            const dist = computeSquaredDist(lat, lng, projLat, projLng)
            if (dist < bestSquaredDist) {
                bestSquaredDist = dist
                bestAlpha = alpha
                bestSegment = seg
                bestLat = projLat
                bestLng = projLng
            }
        }

        if (!bestSegment) return
        return {
            alpha: bestAlpha / bestSegment.len,
            index: bestSegment.idx0,
            lat: bestLat,
            lng: bestLng,
        }
    }
}

function findSegments(
    lat: number,
    lng: number,
    node: IProximumNode
): IProximumSegment[] {
    const nodeLeave = node as IProximumNodeLeave
    if (nodeLeave.segments) return nodeLeave.segments

    const nodePure = node as IProximumNodePure
    if (lat > nodePure.center.lat) {
        // North
        if (lng > nodePure.center.lng) {
            // East
            return findSegments(lat, lng, nodePure.childNE)
        } else {
            // West
            return findSegments(lat, lng, nodePure.childNW)
        }
    } else {
        // South
        if (lng > nodePure.center.lng) {
            // East
            return findSegments(lat, lng, nodePure.childSE)
        } else {
            // West
            return findSegments(lat, lng, nodePure.childSW)
        }
    }

    return []
}

function dotProduct(x1: number, y1: number, x2: number, y2: number): number {
    return x1 * x2 + y1 * y2
}

function computeSquaredDist(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    const x = x1 - x2
    const y = y1 - y2
    return x * x + y * y
}

function clamp(value: number, min: number, max: number): number {
    if (value < min) return min
    if (value > max) return max
    return value
}
