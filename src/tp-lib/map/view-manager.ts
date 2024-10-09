import Leaf from "leaflet"
import { GeoBounds, GeoPoint } from "tp-lib/types"

const DEFAULT_TRANSITION_DELAY = 500

export default class MapView {
    constructor(private readonly map: Leaf.Map) {}

    getBounds(): GeoBounds {
        const { map } = this
        const bounds = map.getBounds()
        return {
            e: bounds.getEast(),
            w: bounds.getWest(),
            n: bounds.getNorth(),
            s: bounds.getSouth(),
        }
    }

    computeDistanceInPixels(point1: GeoPoint, point2: GeoPoint) {
        const { map } = this
        const pix1 = map.latLngToLayerPoint(point1)
        const pix2 = map.latLngToLayerPoint(point2)
        const x1 = pix1.x
        const y1 = pix1.y
        const x2 = pix2.x
        const y2 = pix2.y
        const x = x1 - x2
        const y = y1 - y2
        return Math.sqrt(x * x + y * y)
    }

    set zoom(level: number) {
        const { map } = this
        map.setZoom(level, { animate: false })
    }
    get zoom() {
        const { map } = this
        return map.getZoom()
    }

    zoomIn(delta: number = 1): number {
        const { map } = this
        map.setZoom(map.getZoom() + delta, { animate: true, duration: 300 })
        return map.getZoom()
    }

    zoomOut(delta: number = 1): number {
        const { map } = this
        map.setZoom(map.getZoom() - delta, { animate: true, duration: 300 })
        return map.getZoom()
    }

    /**
     * This method will animate the zoom.
     * If you need instant zoom setting, please use the property `zoom`.
     * @param duration Milliseconds.
     */
    zoomTo(level: number, duration: number = DEFAULT_TRANSITION_DELAY) {
        const { map } = this
        map.setZoom(level, { animate: true, duration: duration * 0.001 })
    }

    set center(coords: GeoPoint) {
        const { map } = this
        map.panTo(coords, { animate: false })
    }
    get center(): GeoPoint {
        const { map } = this
        return map.getCenter()
    }

    /**
     * This method will animate the center.
     * If you need instant center setting, please use the property `center`.
     * @param duration Milliseconds.
     */
    centerTo(coords: GeoPoint, duration: number = DEFAULT_TRANSITION_DELAY) {
        const { map } = this
        map.panTo(
            { lat: coords.lat, lng: coords.lng },
            {
                animate: true,
                duration: duration * 0.001,
            }
        )
    }

    /**
     * Animate both center and zoom.
     * @param duration Milliseconds.
     */
    centerAndZoomTo(
        coords: GeoPoint,
        zoom: number,
        duration: number = DEFAULT_TRANSITION_DELAY
    ) {
        const { map } = this
        map.panTo(coords, { animate: false })
        map.setZoom(zoom, { animate: true, duration: duration * 0.001 })
    }

    /**
     * Change center and zoom to fit specified bounds.
     * @param animDuration Milliseconds.
     */
    fitBounds(bounds: GeoBounds, options?: Partial<FitBoundsOptions>) {
        const { map } = this
        const opts: FitBoundsOptions = {
            padding: 0,
            animDuration: 0,
            ...options,
        }
        protectAgainstEmptyBounds(bounds)
        if (typeof opts.padding === "number") {
            const pad = opts.padding
            opts.padding = [pad, pad, pad, pad]
        } else if (opts.padding.length === 2) {
            const [topBottom, leftRight] = opts.padding
            opts.padding = [topBottom, leftRight, topBottom, leftRight]
        }
        const [top, right, bottom, left] = opts.padding
        map.fitBounds(
            [
                [bounds.s, bounds.w],
                [bounds.n, bounds.e],
            ],
            {
                paddingTopLeft: [top, left],
                paddingBottomRight: [bottom, right],
                animate: opts.animDuration > 0,
                duration: opts.animDuration * 0.001,
                maxZoom: 20,
            }
        )
    }
}

export interface FitBoundsOptions {
    padding:
        | number
        | [topBottom: number, leftRight: number]
        | [top: number, right: number, bottom: number, left: number]
    animDuration: number
}

function protectAgainstEmptyBounds(bounds: GeoBounds) {
    const MIN = 1e-4
    if (bounds.n < bounds.s)
        bounds.n += Math.ceil((bounds.s - bounds.n) / 180) * 180
    if (bounds.e < bounds.w)
        bounds.e += Math.ceil((bounds.w - bounds.e) / 360) * 360
    const latDelta = bounds.n - bounds.s
    if (latDelta < MIN) {
        bounds.n += MIN
        bounds.s -= MIN
    }
    const lngDelta = bounds.e - bounds.w
    if (lngDelta < MIN) {
        bounds.e += MIN
        bounds.w -= MIN
    }
}
