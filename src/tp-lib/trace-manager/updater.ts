import { GeoPoint, IGeoPoint, MarkerData } from "tp-lib/types"
import Proximum from "../proximum"
import { clone } from "../tools/clone"
import GenericEvent from "../tools/generic-event"
import { SecondaryTraceData, TraceData } from "../types/trace-data"
import {
    DEFAULT_TRACE_DATA_ATTRIBUTES,
    DEFAULT_TRACE_DATA_CHILDREN,
    DEFAULT_TRACE_DATA_MAP,
    DEFAULT_TRACE_DATA_MARKERS,
    DEFAULT_TRACE_DATA_POINTS,
} from "./constants"

interface Rollback {
    undo: Partial<TraceData>
    redo: Partial<TraceData>
}

export default class TraceUpdater {
    /** Id of the current event, or 0 if none. */
    public readonly eventCurrentMarkerChange = new GenericEvent<number>()
    public readonly eventTraceChange = new GenericEvent<Partial<TraceData>>()
    public readonly eventUndoChange = new GenericEvent<TraceUpdater>()
    public readonly eventMapSourceChange = new GenericEvent<string>()
    public readonly eventMapFilterChange = new GenericEvent<string>()

    private _proximum: Proximum | undefined
    private _currentMarkerId = 0
    private readonly rollbackList: Rollback[] = []
    private rollbackLength = 0

    constructor(private trace: TraceData) {
        this.eventTraceChange.add((data) => {
            if (data.lat || data.lng) {
                // Proximum is now obsolete because points
                // have changed.
                this._proximum = undefined
            }
        })
    }

    get mapSource() {
        return this.trace.map ?? "osm"
    }
    private set mapSource(id: string) {
        if (id !== this.trace.map) {
            this.trace.map = id
            this.eventMapSourceChange.fire(id)
        }
    }

    get mapFilter() {
        return this.trace.filter ?? "osm"
    }
    private set mapFilter(filter: string) {
        if (filter !== this.trace.filter) {
            this.trace.map = filter
            this.eventMapFilterChange.fire(filter)
        }
    }

    get currentMarkerId() {
        return this._currentMarkerId
    }
    set currentMarkerId(id: number) {
        let currentMarkerId = 0
        if (id > 0) {
            const marker = this.trace.markers.find((mrk) => mrk.id === id)
            if (marker) currentMarkerId = id
        }
        if (this._currentMarkerId !== currentMarkerId) {
            this._currentMarkerId = currentMarkerId
            this.eventCurrentMarkerChange.fire(currentMarkerId)
        }
    }

    get currentMarker(): MarkerData | undefined {
        const marker = this.trace.markers.find(
            (mrk) => mrk.id === this._currentMarkerId
        )
        if (!marker) return

        return { ...marker }
    }

    findMarker({ lat, lng }: GeoPoint): MarkerData | undefined {
        const EPSILON = 1e-9
        const { markers } = this.trace
        for (const mrk of markers) {
            const deltaLat = Math.abs(lat - mrk.lat)
            if (deltaLat > EPSILON) continue
            const deltaLng = Math.abs(lng - mrk.lng)
            if (deltaLng > EPSILON) continue
            return mrk
        }
        return undefined
    }

    get value() {
        return { ...this.trace }
    }

    get canUndo() {
        return this.rollbackLength > 0
    }

    get canRedo() {
        return this.rollbackLength < this.rollbackList.length
    }

    undo(): boolean {
        if (!this.canUndo) return false

        const { undo } = this.rollbackList[this.rollbackLength - 1]
        this.update(undo, false)
        this.rollbackLength--
        this.eventUndoChange.fire(this)
        return true
    }

    redo(): boolean {
        if (!this.canRedo) return false

        const { redo } = this.rollbackList[this.rollbackLength]
        this.update(redo, false)
        this.rollbackLength++
        this.eventUndoChange.fire(this)
        return true
    }

    public readonly update = (value: Partial<TraceData>, recordUndo = true) => {
        const rollback: Record<string, unknown> = {}
        const updatedKeys: Array<keyof TraceData> = []
        let updateNeeded = false
        const trace = this.trace as { [key in keyof TraceData]: unknown }
        const keys = Object.keys(value) as Array<keyof TraceData>
        for (const key of keys) {
            const oldVal = trace[key]
            const newVal = value[key]
            if (JSON.stringify(oldVal) === JSON.stringify(newVal)) continue

            rollback[key] = oldVal
            trace[key] = newVal
            updatedKeys.push(key)
            updateNeeded = true
        }
        if (updateNeeded) {
            if (recordUndo) this.addToUndoList(rollback, clone(value))
            this.eventTraceChange.fire(value)
        }
    }

    removeMarker(markerId: number) {
        const markers = this.trace.markers.filter((mrk) => mrk.id !== markerId)
        this.update({ markers })
        if (this.currentMarkerId === markerId) this.currentMarkerId = -1
    }

    /**
     * Create a new marker.
     * @returns Id of this new marker.
     */
    addMarker(newMarker: Omit<MarkerData, "id">): number {
        const { markers } = this.trace
        const id = 1 + markers.reduce((val, mrk) => Math.max(val, mrk.id), 0)
        const marker: MarkerData = { id, ...newMarker }
        this.figureOutMarkerIndex(marker)
        this.update({ markers: [...markers, marker] })
        return id
    }

    updateMarker(marker: MarkerData) {
        this.figureOutMarkerIndex(marker)
        const markers = this.trace.markers.map((mrk) =>
            mrk.id === marker.id ? marker : mrk
        )
        this.update({ markers })
    }

    private figureOutMarkerIndex(marker: MarkerData) {
        const { proximum } = this
        const pos = proximum.find(marker.lat, marker.lng)
        if (pos) {
            marker.index = pos.index + (pos.alpha < 0.5 ? 0 : 1)
        } else {
            // Not on the trace.
            delete marker.index
        }
    }

    /**
     * Remove a secondary trace.
     */
    removeChild(id: number) {
        const { children } = this.trace
        if (!children) return

        this.update({ children: children.filter((child) => child.id !== id) })
    }

    addChild(secondaryTrace: SecondaryTraceData) {
        const children = [
            secondaryTrace,
            ...(this.trace.children ?? []).filter(
                (child) => child.id !== secondaryTrace.id
            ),
        ]
        this.update({ children })
    }

    updateChild(secondaryTrace: SecondaryTraceData): boolean {
        const { children } = this.trace
        if (!children) return false

        const index = children.findIndex(({ id }) => secondaryTrace.id === id)
        if (index < 0) return false

        children[index] = secondaryTrace
        this.update({ children })
        return true
    }

    /**
     * @returns Array of markers not at `point`.
     */
    private getMarkersExceptHere(point: IGeoPoint): MarkerData[] {
        return this.trace.markers.filter((mrk) => {
            const deltaLat = Math.abs(mrk.lat - point.lat)
            if (deltaLat > 1e-7) return true

            const deltaLng = Math.abs(mrk.lng - point.lng)
            if (deltaLng > 1e-7) return true

            return false
        })
    }

    private addToUndoList(undo: Partial<TraceData>, redo: Partial<TraceData>) {
        this.rollbackList.splice(this.rollbackLength)
        this.rollbackList.push({ undo, redo })
        this.rollbackLength = this.rollbackList.length
        this.eventUndoChange.fire(this)
    }

    private get proximum(): Proximum {
        if (!this._proximum) this._proximum = new Proximum(this.trace)
        return this._proximum
    }
}

const ATTRIBUTES_KEYS = new Set(Object.keys(DEFAULT_TRACE_DATA_ATTRIBUTES))
const CHILDREN_KEYS = new Set(Object.keys(DEFAULT_TRACE_DATA_CHILDREN))
const MAP_KEYS = new Set(Object.keys(DEFAULT_TRACE_DATA_MAP))
const MARKERS_KEYS = new Set(Object.keys(DEFAULT_TRACE_DATA_MARKERS))
const POINTS_KEYS = new Set(Object.keys(DEFAULT_TRACE_DATA_POINTS))
