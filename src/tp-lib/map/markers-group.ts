import { MapManager, MarkerEvent } from "."
import GenericEvent from "../tools/generic-event"
import { IGeoPoint } from "tp-lib/types"
import { Marker } from "./marker-manager"

export interface MarkerDefinition<Data extends IGeoPoint> {
    id: number
    data: Data
}

/**
 * You can group markers and listen on tap and drag events for them.
 * You can have your own type for markers (Data) provided it defines at
 * least `lat` and `lng.
 */
export default class MarkersGroup<Data extends IGeoPoint> {
    public readonly eventTap = new GenericEvent<MarkerDefinition<Data>>()
    public readonly eventMove = new GenericEvent<MarkerDefinition<Data>>()
    /**
     * Triggered every time a marker is added or removed.
     * But also triggered is a marker has been updated.
     * @see list()
     */
    public readonly eventListChange = new GenericEvent<void>()
    /**
     * Map Id with Data.
     */
    private readonly mapMarkers = new Map<number, Data>()

    /**
     * @param map The map where the markers will be shown.
     * @param factory A function that creates an actual marker from the given data.
     */
    constructor(
        private readonly map: MapManager,
        private factory: (data: Data) => Marker
    ) {
        map.marker.eventTap.add(this.handleTap)
        map.marker.eventMove.add(this.handleMove)
    }

    /**
     * @returns The list of all markers.
     */
    public list(): MarkerDefinition<Data>[] {
        const entries = Array.from(this.mapMarkers.entries())
        return entries.map(([id, data]) => ({ id, data }))
    }

    /**
     * @returns The IDs of all the markers of this group.
     */
    public listIds(): number[] {
        return Array.from(this.mapMarkers.keys())
    }

    /**
     * Remove all markers of this group.
     */
    public clear() {
        const { map, mapMarkers } = this
        const ids = Array.from(mapMarkers.keys())
        if (ids.length === 0) return

        for (const id of ids) {
            map.marker.remove(id)
        }
        mapMarkers.clear()
        this.eventListChange.fire()
    }

    /**
     * Update the marker with a partial `data`.
     * @returns `false` if there is no such marker with this ID.
     */
    public update(id: number, data: Partial<Data>): boolean {
        const { map, mapMarkers } = this
        const previousData = mapMarkers.get(id)
        if (!previousData) return false

        const newData = {
            ...previousData,
            ...data,
        }
        mapMarkers.set(id, newData)
        const found = map.marker.update(id, this.factory(newData))
        this.eventListChange.fire()
        return found
    }

    /**
     * Create a new marker with the given `data`.
     * @returns ID of the new marker.
     */
    public add(data: Data): number {
        const { map, mapMarkers } = this
        const id = map.marker.add(this.factory(data))
        mapMarkers.set(id, data)
        this.eventListChange.fire()
        return id
    }

    public remove(markerId: number): boolean {
        if (!this.has(markerId)) return false

        const { map, mapMarkers } = this
        map.marker.remove(markerId)
        mapMarkers.delete(markerId)
        this.eventListChange.fire()
        return true
    }

    public has(markerId: number): boolean {
        return this.mapMarkers.has(markerId)
    }

    /**
     * @returns Marker with given ID. Throw an exception if not found.
     */
    public get(markerId: number): Data {
        const data = this.mapMarkers.get(markerId)
        if (!data) throw `Marker #${markerId} not found!`

        return data
    }

    private handleTap = (evt: MarkerEvent) => {
        const { id, lat, lng } = evt
        if (!this.mapMarkers.has(id)) {
            return
        }

        const data = this.mapMarkers.get(id)
        if (data) {
            this.eventTap.fire({ id, data })
        }
    }

    private handleMove = (evt: MarkerEvent) => {
        const { id, lat, lng } = evt
        if (!this.mapMarkers.has(id)) return

        const data = this.mapMarkers.get(id)
        if (data) {
            data.lat = lat
            data.lng = lng
            this.eventMove.fire({ id, data })
        }
    }
}
