import { MarkerData, MarkerType, TraceBounds, TraceData } from "tp-lib/types"
import Async from "../../tools/async"
import GenericEvent from "../../tools/generic-event"
import { computeTraceBounds } from "../../trace-manager"
import { findIndexFromDistance } from "../../trace-manager/search"
import PointerWatcher from "../../watcher/pointer"
import ResizeWatcher from "../../watcher/resize"

export interface ProfileSelection {
    startIndex: number
    endIndex: number
    // x is between 0 and 100.
    startX: number
    // x is between 0 and 100.
    endX: number
}

interface ProfileViewSelection {
    fromIndex: number
    toIndex: number
}

const SNAP_PRECISION = 7
const TOP_MARGIN = 4

export default class ProfileManager {
    public readonly eventSelectionChanged = new GenericEvent<ProfileSelection>()
    /**
     * Dispatch the index of the point.
     */
    public readonly eventDoubleClick = new GenericEvent<number>()
    private readonly resizeWatcher: ResizeWatcher
    private readonly bounds: TraceBounds
    private readonly imageMap = new Map<string, HTMLImageElement>()
    private readonly pointerWatcher: PointerWatcher
    private startIndex = 0
    private startX = 0
    /**
     * X coordinates of markers. The mouse will snap on them to ease
     * the selection of a section between actual markers.
     */
    private snapPoints: number[] = []
    /**
     * When there is a selection, you can only remove it by clicking,
     * not just byb hovering the mouse.
     */
    private hasSelection = false
    private readonly markers: MarkerData[]

    constructor(
        private readonly trace: TraceData,
        private readonly canvas: HTMLCanvasElement
    ) {
        this.markers = trace.markers.filter(
            ({ type }) => type === MarkerType.primary
        )
        this.resizeWatcher = new ResizeWatcher()
        this.resizeWatcher.register(canvas, this.repaint)
        this.bounds = computeTraceBounds(trace)
        this.paint(canvas)
        this.loadMarkersIcons()
        this.pointerWatcher = new PointerWatcher(canvas, {
            onDblClick: (evt) => {
                const x = this.snapX(evt.x)
                const idx = this.xToIdx(x)
                this.eventDoubleClick.fire(idx)
            },
            onDown: (evt) => {
                this.hasSelection = false
                const x = this.snapX(evt.x)
                const idx = this.xToIdx(x)
                this.eventSelectionChanged.fire({
                    startX: this.percentX(x),
                    endX: this.percentX(x),
                    startIndex: idx,
                    endIndex: idx,
                })
                this.startX = x
                this.startIndex = idx
            },
            onMove: (evt) => {
                if (this.hasSelection) return

                const x = this.snapX(evt.x)
                const idx = this.xToIdx(x)
                this.eventSelectionChanged.fire({
                    startX: this.percentX(x),
                    endX: this.percentX(x),
                    startIndex: idx,
                    endIndex: idx,
                })
                this.startX = x
                this.startIndex = idx
            },
            onDrag: (evt) => {
                this.hasSelection = true
                const x = this.snapX(evt.x)
                const idx = this.xToIdx(x)
                this.eventSelectionChanged.fire({
                    startX: this.percentX(Math.min(this.startX, x)),
                    endX: this.percentX(Math.max(this.startX, x)),
                    startIndex: Math.min(this.startIndex, idx),
                    endIndex: Math.max(this.startIndex, idx),
                })
            },
        })
    }

    detach() {
        this.resizeWatcher.unregister(this.canvas, this.repaint)
        this.pointerWatcher.detach()
    }

    readonly paint = (elem: Element) => {
        const { canvas, bounds, trace } = this
        const { alt: altitudes, dis: distances } = trace
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const { width, height } = elem.getBoundingClientRect()
        const stepInMeters =
            (3 * (distances[distances.length - 1] - distances[0])) / width
        canvas.width = width
        canvas.height = height
        const { toX, toY, toPreciseX } = getCoordsConverters(
            bounds,
            width,
            height - TOP_MARGIN
        )
        const points = makePoints(distances, altitudes, stepInMeters, toX, toY)
        ctx.clearRect(0, 0, width, height)
        this.paintProfileGraph(ctx, points, width, height)
        this.paintProfileRim(ctx, points)
        this.paintProfileMarkers(ctx, trace, height, toX, toY, toPreciseX)
    }

    private readonly repaint = Async.Debouncer(this.paint, 200)

    private paintProfileMarkers(
        ctx: CanvasRenderingContext2D,
        trace: TraceData,
        height: number,
        toX: (dis: number) => number,
        toY: (alt: number) => number,
        toPreciseX: (dis: number) => number
    ) {
        const { markers } = this
        ctx.strokeStyle = "#0004"
        ctx.lineWidth = 1
        const { imageMap, snapPoints } = this
        snapPoints.splice(0, snapPoints.length)
        for (const mrk of markers) {
            if (typeof mrk.index !== "number") continue
            if (mrk.icons.length === 0) continue

            const [url] = mrk.icons
            const img = imageMap.get(url)
            if (!img) continue

            const dis = trace.dis[mrk.index]
            const alt = trace.alt[mrk.index]
            const x = toX(dis)
            const y = Math.min(toY(alt) + 8, height - 32)
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x, height - 32)
            ctx.stroke()
            ctx.drawImage(img, x - 16, height - 32, 32, 32)
            snapPoints.push(toPreciseX(dis))
        }
    }

    private paintProfileRim(
        ctx: CanvasRenderingContext2D,
        points: [x: number, y: number][]
    ) {
        if (points.length < 1) return

        ctx.save()
        ctx.imageSmoothingQuality = "high"
        ctx.strokeStyle = "#0f0"
        ctx.lineWidth = 2
        ctx.beginPath()
        const [[x, y]] = points
        ctx.moveTo(x, y)
        for (const [x, y] of points) ctx.lineTo(x, y)
        ctx.stroke()
        ctx.restore()
    }

    private paintProfileGraph(
        ctx: CanvasRenderingContext2D,
        points: [x: number, y: number][],
        width: number,
        height: number
    ) {
        ctx.save()
        ctx.shadowColor = "#000e"
        ctx.shadowBlur = 4
        ctx.shadowOffsetY = -3
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, "#fff")
        grad.addColorStop(0.25, "#dfd")
        grad.addColorStop(1, "#060")
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(0, height)
        for (const [x, y] of points) ctx.lineTo(x, y)
        ctx.lineTo(width, height)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
    }

    private percentX(x: number): number {
        const { canvas } = this
        return (100 * x) / canvas.width
    }

    private xToDis(x: number): number {
        const { trace, canvas } = this
        const { dis } = trace
        if (!dis) return 0

        return dis[0] + ((dis[dis.length - 1] - dis[0]) * x) / canvas.width
    }

    private xToIdx(x: number): number {
        const { trace } = this
        const dis = this.xToDis(x)
        return findIndexFromDistance(trace, dis)
    }

    private snapX(x: number): number {
        const { canvas } = this
        x = Math.max(0, Math.min(canvas.width, x))
        for (const snap of this.snapPoints) {
            const dis = Math.abs(snap - x)
            if (dis < SNAP_PRECISION) return snap
        }
        return x
    }
    private loadMarkersIcons() {
        const { canvas, imageMap } = this
        const { markers } = this

        for (const mrk of markers) {
            if (typeof mrk.index !== "number") continue

            if (mrk.icons.length === 0) continue

            const [url] = mrk.icons
            if (!url || imageMap.has(url)) continue

            const img = new Image()
            imageMap.set(url, img)
            img.src = url
            img.onload = () => this.repaint(canvas)
        }
    }
}

const MARGIN_BOTTOM = 24
const HALF = 0.5

function getCoordsConverters(
    bounds: TraceBounds,
    width: number,
    height: number
) {
    const altMin = bounds.altMin ?? 0
    const altMax = bounds.altMax ?? 9000
    const disMin = bounds.disMin ?? 0
    const disMax = bounds.disMax ?? 100
    const xFactor = width / Math.max(0.000001, disMax - disMin)
    const yFactor =
        (height - MARGIN_BOTTOM) / Math.max(0.000001, altMax - altMin)
    const toPreciseX = (dis: number) => (dis - disMin) * xFactor
    const toPreciseY = (alt: number) =>
        height - MARGIN_BOTTOM - (alt - altMin) * yFactor
    return {
        toPreciseX,
        toX: (dis: number) => HALF + Math.floor(toPreciseX(dis)),
        toPreciseY,
        toY: (alt: number) => HALF + Math.floor(toPreciseY(alt)),
    }
}

function makePoints(
    distances: number[],
    altitudes: number[],
    stepInMeters: number,
    toX: (dis: number) => number,
    toY: (alt: number) => number
) {
    const points: Array<[x: number, y: number]> = []
    let nextDistance = 0
    for (let i = 0; i < distances.length; i++) {
        const dis = distances[i] ?? 0
        if (dis < nextDistance) continue

        nextDistance += stepInMeters
        const alt = altitudes[i]
        const x = toX(dis)
        const y = toY(alt) + TOP_MARGIN
        points.push([x, y])
    }
    return points
}
