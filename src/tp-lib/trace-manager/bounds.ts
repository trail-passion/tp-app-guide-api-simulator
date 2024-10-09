import { TraceBounds, TraceData } from "tp-lib/types"

export function computeTraceBounds(traceData: TraceData): TraceBounds {
    const bounds: TraceBounds = {
        n: -999,
        s: 999,
        e: -999,
        w: 999,
        disMin: Number.MAX_SAFE_INTEGER,
        disMax: 0,
        altMin: Number.MAX_SAFE_INTEGER,
        altMax: -Number.MAX_SAFE_INTEGER,
    }

    if (traceData.children && traceData.children.length > 0) {
        for (const child of traceData.children) {
            bounds.n = Math.max(bounds.n, child.bounds.n)
            bounds.s = Math.min(bounds.s, child.bounds.s)
            bounds.e = Math.max(bounds.e, child.bounds.e)
            bounds.w = Math.min(bounds.w, child.bounds.w)
        }
    } else if (traceData.lat.length > 0) {
        const [firstLat] = traceData.lat
        const [firstLng] = traceData.lng
        bounds.n = firstLat
        bounds.s = firstLat
        bounds.e = firstLng
        bounds.w = firstLng
        for (let i = 1; i < traceData.lat.length; i++) {
            const lat = traceData.lat[i]
            if (!isNaN(lat)) {
                bounds.n = Math.max(bounds.n, lat)
                bounds.s = Math.min(bounds.s, lat)
            }
            const lng = traceData.lng[i]
            if (!isNaN(lng)) {
                bounds.e = Math.max(bounds.e, lng)
                bounds.w = Math.min(bounds.w, lng)
            }
        }
    }

    if (traceData.alt.length > 0) {
        const [firstAlt] = traceData.alt
        for (const alt of traceData.alt) {
            bounds.altMin = Math.min(bounds.altMin, alt)
            bounds.altMax = Math.max(bounds.altMax, alt)
        }
    }
    if (traceData.dis.length > 0) {
        bounds.disMin = traceData.dis[0]
        bounds.disMax = traceData.dis.at(-1) ?? bounds.disMin
    }
    for (const { lat, lng } of traceData.markers) {
        if (!isNaN(lat)) {
            bounds.n = Math.max(bounds.n, lat)
            bounds.s = Math.min(bounds.s, lat)
        }
        if (!isNaN(lng)) {
            bounds.e = Math.max(bounds.e, lng)
            bounds.w = Math.min(bounds.w, lng)
        }
    }
    return bounds
}
