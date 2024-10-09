import GenericEvent from "../generic-event"
import { MinimalTrace } from "../../types/types"
import { GeoPoint, TraceData } from "tp-lib/types"

/**
 * An action is a splice on arrays.
 */
interface IAction {
    start: number
    deleteCount: number
    lat: number[]
    lng: number[]
}

/**
 * Cut/insert parts of a trace with undo/redo features.
 */
export default class TraceEditor<
    GenericTrace extends MinimalTrace = TraceData,
> {
    private _trace: GenericTrace
    private readonly undos: IAction[]
    // Fired anytime the trace is modified by the editor.
    public readonly eventChange = new GenericEvent<GenericTrace>()
    public readonly eventAvailableUndos = new GenericEvent<number>()

    constructor(trace: GenericTrace) {
        this._trace = trace
        this.undos = []
    }

    get trace(): GenericTrace {
        return this._trace
    }

    get size() {
        return this.undos.length
    }

    exec(action: IAction, undoable: boolean = true) {
        const { trace } = this
        const deletedLats = trace.lat.splice(
            action.start,
            action.deleteCount,
            ...action.lat
        )
        const deletedLngs = trace.lng.splice(
            action.start,
            action.deleteCount,
            ...action.lng
        )
        if (undoable) {
            this.undos.push({
                start: action.start,
                deleteCount: action.lat.length,
                lat: deletedLats,
                lng: deletedLngs,
            })
            this.eventAvailableUndos.fire(this.undos.length)
        }
        // We copy the trace to be sure it's new.
        this._trace = { ...trace }
        this.eventChange.fire(this._trace)
    }

    execCut(start: number, end = -1) {
        this.exec({
            deleteCount: end > start ? end - start : 1,
            start,
            lat: [],
            lng: [],
        })
    }

    execAppendPoint(point: GeoPoint) {
        const { trace } = this
        this.exec({
            deleteCount: 0,
            start: trace.lat.length,
            lat: [point.lat],
            lng: [point.lng],
        })
    }

    execInsertAfter(index: number, lat: number[], lng: number[]) {
        this.exec({
            deleteCount: 0,
            start: index + 1,
            lat,
            lng,
        })
    }

    execInsertPoint(indexOfPreviousPoint: number, point: GeoPoint) {
        this.exec({
            deleteCount: 0,
            start: indexOfPreviousPoint + 1,
            lat: [point.lat],
            lng: [point.lng],
        })
    }

    execMovePoint(index: number, point: GeoPoint) {
        this.exec({
            deleteCount: 1,
            start: index,
            lat: [point.lat],
            lng: [point.lng],
        })
    }

    execReplaceTrace(newTrace: GenericTrace) {
        this.exec({
            start: 0,
            deleteCount: this.trace.lat.length,
            ...newTrace,
        })
    }

    execInvertTrace() {
        const { trace } = this
        const lat: number[] = []
        const lng: number[] = []
        for (let i = 0; i < trace.lat.length; i++) {
            lat.unshift(trace.lat[i])
            lng.unshift(trace.lng[i])
        }
        this.execReplaceTrace({ ...this.trace, lat, lng })
    }

    undo(): boolean {
        const { undos } = this
        const action = undos.pop()
        if (!action) return false

        this.exec(action, false)
        this.eventAvailableUndos.fire(undos.length)
        return true
    }

    export(): IAction[] {
        return [...this.undos]
    }

    import(undos: IAction[]) {
        this.undos.splice(0, this.undos.length, ...undos)
        this.eventAvailableUndos.fire(this.undos.length)
    }
}
