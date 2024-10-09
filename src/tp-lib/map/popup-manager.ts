import { createRoot } from "react-dom/client"
import Leaf from "leaflet"

import { GeoPoint } from "tp-lib/types"

import "./popup-manager.css"

export default class PopupManager {
    private popup?: Leaf.Popup

    constructor(private readonly map: Leaf.Map) {}

    show(point: GeoPoint, content: string | JSX.Element, className?: string) {
        this.hide()
        const popup = new Leaf.Popup({
            autoClose: true,
            keepInView: true,
            closeOnEscapeKey: true,
            closeOnClick: false,
            autoPan: true,
            className: `guide-map-PopupManager ${className}`,
            minWidth: 290,
        })
        this.popup = popup
        popup.setLatLng(point)
        if (typeof content === "string") {
            popup.setContent(content)
        } else {
            const container = window.document.createElement("div")
            if (container) createRoot(container).render(content)
            popup.setContent(container)
        }
        const p = popup.openOn(this.map)
        popup.bringToFront()
    }

    hide() {
        const { popup } = this
        if (!popup) return

        popup.removeFrom(this.map)
    }
}
