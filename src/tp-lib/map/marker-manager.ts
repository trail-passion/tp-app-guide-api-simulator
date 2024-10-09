import EmptyMarkerUrl from "../gfx/empty-marker.png"
import GenericEvent from "../tools/generic-event"
import Leaf from "leaflet"

import "./marker-manager.css"

export interface Marker {
    lat: number
    lng: number
    /** Display an image */
    icon?: {
        url: string
        size?: [width: number, height: number]
        /** (0,0) is top-left corner of the image */
        anchor?: [x: number, y: number]
        className?: string
    }
    label?: string
    labelAnchor?: "top" | "bottom" | "left" | "right" | "center"
    labelClassName?: string
    /** Display a disk with a radius expressed in meters */
    disk?: {
        /** Radius in meters */
        radius: number
        fill: string
        stroke: string
        thickness: number
    }
    /** Default: false */
    draggable?: boolean
    /** Default: false */
    clickable?: boolean
    /**
     * @param marker The marker that has been clicked
     * @returns `true` if the event has been taken care of and
     * we want to prevent the `eventTap` to trigger.
     */
    onClick?(marker: Marker): boolean
}

export interface MarkerEvent {
    /** Marker's ID */
    id: number
    lat: number
    lng: number
}

/**
 * It would be interesting to get the origin position of moved marker,
 * but the `oldLatLng` property on the "move" event is not defined
 * in the types of Leaflet v1.7.4.
 */
export interface MarkerMoveEvent extends MarkerEvent {
    origin: {
        lat: number
        lng: number
    }
}

export default class MarkerManager {
    public eventTap = new GenericEvent<MarkerEvent>()
    /** Market has been move programmatically or after dragging. */
    public eventMove = new GenericEvent<MarkerEvent>()
    /** Marker dragging starts. */
    public eventDragStart = new GenericEvent<MarkerEvent>()
    /** Marker is being dragged. */
    public eventDrag = new GenericEvent<MarkerEvent>()
    /** Marker dragging ends. */
    public eventDragEnd = new GenericEvent<MarkerEvent>()
    private availableId = 1
    private readonly markers = new Map<
        number,
        { leaf: Leaf.Marker; disk?: Leaf.Circle; def: Marker }
    >()

    constructor(private readonly map: Leaf.Map) {}

    /**
     * @returns The marker with the given `id`, or null.
     */
    public get(id: number): Marker | null {
        const mrk = this.markers.get(id)
        if (!mrk) return null

        return mrk.def
    }

    /**
     * Update a marker and keep its Id.
     */
    update(id: number, marker: Partial<Marker>): boolean {
        const data = this.markers.get(id)
        if (!data) return false

        this.remove(id)
        this.addWithId(
            {
                ...data.def,
                ...marker,
            },
            id
        )
        return true
    }

    add(marker: Marker): number {
        const id = this.availableId++
        return this.addWithId(marker, id)
    }

    private addWithId(marker: Marker, id: number) {
        const disk = createDiskMarker(marker)
        if (disk) disk.addTo(this.map)
        const mrk = new Leaf.Marker(marker, {
            draggable: marker.draggable,
            title: marker.clickable ? "ON" : "Off",
            icon: convertIcon(marker),
            autoPan: true,
            autoPanPadding: [32, 32],
            opacity: 1,
            riseOnHover: true,
            bubblingMouseEvents: false,
        })
        if (marker.label) {
            const tooltip = new Leaf.Tooltip({
                className: getTooltipClassName(marker),
                permanent: true,
                direction: convertAnchorIntoDirection(marker.labelAnchor),
                interactive: marker.clickable,
            })
            tooltip.setLatLng(marker)
            const divContent = document.createElement("div")
            if (marker.labelClassName) {
                divContent.classList.add(marker.labelClassName)
            }
            divContent.textContent = marker.label
            tooltip.setContent(divContent)
            mrk.bindTooltip(tooltip)
        }
        mrk.addTo(this.map)
        this.markers.set(id, {
            leaf: mrk,
            disk,
            def: marker,
        })
        if (marker.clickable) {
            mrk.on("click", (evt: Leaf.LeafletMouseEvent) => {
                const mrk = this.markers.get(id)
                if (mrk && mrk.def.onClick) {
                    /**
                     * If there is an `onClick` defined, we call it.
                     * And we can skip the `eventTap` if it returns `true`.
                     */
                    if (mrk.def.onClick(mrk.def) === true) return
                }
                this.eventTap.fire({
                    id,
                    ...evt.latlng,
                })
            })
        }
        mrk.on("move", ((evt: Leaf.LeafletMouseEvent) =>
            this.eventMove.fire({
                id,
                ...evt.latlng,
            })) as Leaf.LeafletEventHandlerFn)
        if (marker.draggable) {
            // mrk.on("dragstart", (evt: Leaf.LeafletMouseEvent) =>
            mrk.on("mousedown", (evt: Leaf.LeafletMouseEvent) =>
                this.eventDragStart.fire({
                    id,
                    ...evt.latlng,
                })
            )
            mrk.on("drag", ((evt: Leaf.LeafletMouseEvent) =>
                this.eventDrag.fire({
                    id,
                    ...evt.latlng,
                })) as Leaf.LeafletEventHandlerFn)
            // mrk.on("dragend", (evt: Leaf.LeafletMouseEvent) =>
            mrk.on("mouseup", (evt: Leaf.LeafletMouseEvent) =>
                this.eventDragEnd.fire({
                    id,
                    ...evt.latlng,
                })
            )
        }
        return id
    }

    remove(markerId: number) {
        const mrk = this.markers.get(markerId)
        if (!mrk) return false

        mrk.leaf.removeFrom(this.map)
        const { disk } = mrk
        if (disk) disk.removeFrom(this.map)
        this.markers.delete(markerId)
        return true
    }

    has(markerId: number) {
        return this.markers.has(markerId)
    }

    /**
     * Remove all markers.
     */
    clear() {
        const { map } = this
        for (const mrk of this.markers.values()) {
            mrk.leaf.removeFrom(map)
        }
        this.markers.clear()
    }
}

function convertIcon(marker: Marker) {
    const { icon } = marker
    if (!icon)
        return new Leaf.Icon({
            iconUrl: EmptyMarkerUrl,
        })

    const options: Leaf.IconOptions = {
        iconUrl: icon.url,
        className: icon.className,
    }
    options.iconSize = icon.size
    options.iconAnchor = icon.anchor
    return new Leaf.Icon(options)
}

function convertAnchorIntoDirection(
    anchor: string | undefined
): Leaf.Direction {
    switch (anchor) {
        case "top":
            return "bottom"
        case "bottom":
            return "top"
        case "left":
            return "right"
        case "right":
            return "left"
        case "center":
            return "center"
        default:
            return "bottom"
    }
}

/**
 * By default Tooltips have `pointer-event: none`.
 * We need to override this for clickable markers.
 */
function getTooltipClassName(marker: Marker): string | undefined {
    if (marker.labelClassName) {
        if (marker.clickable) return "with-className clickable"
        return "with-className"
    }
    return undefined
}

function createDiskMarker(marker: Marker) {
    const { disk } = marker
    if (!disk) return undefined

    return new Leaf.Circle(marker, {
        radius: disk.radius,
        color: disk.stroke,
        fillColor: disk.fill,
        stroke: Boolean(disk.stroke),
        fill: Boolean(disk.fill),
        weight: disk.thickness,
    })
}
