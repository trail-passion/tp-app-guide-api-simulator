import Leaf from "leaflet"
import React from "react"
import { createRoot } from "react-dom/client"

import GenericEvent from "../tools/generic-event"

import "./overlay-manager.css"

export interface Overlay {
    lat: number
    lng: number
    content: JSX.Element
}

export interface OverlayEvent {
    id: number
    lat: number
    lng: number
}

const PREFIX = "guide-map-Overlay:"

export default class OverlayManager {
    public eventTap = new GenericEvent<OverlayEvent>()
    private availableId = 1
    private readonly overlays = new Map<number, Leaf.Tooltip>()

    constructor(private readonly map: Leaf.Map) {}

    add(overlay: Overlay): number {
        const id = this.availableId++
        const tooltip = new Leaf.Tooltip({
            direction: "center",
            interactive: true,
            opacity: 1,
            permanent: true,
            className: "guide-map-OverlayManager-tooltip",
        })
        this.overlays.set(id, tooltip)
        tooltip.setLatLng(overlay)
        const container = window.document.createElement("div")
        if (container) createRoot(container).render(<>{overlay.content}</>)
        tooltip.setContent(container)
        tooltip.addTo(this.map)
        return id
    }

    remove(overlayId: number) {
        const mrk = this.overlays.get(overlayId)
        if (!mrk) return false

        mrk.removeFrom(this.map)
        this.overlays.delete(overlayId)
        return true
    }

    has(overlayId: number) {
        return this.overlays.has(overlayId)
    }

    /**
     * Remove all overlays.
     */
    clear() {
        const { map } = this
        for (const overlay of this.overlays.values()) {
            overlay.removeFrom(map)
        }
        this.overlays.clear()
    }
}
