import Color from "../ui/color"
import Leaf from "leaflet"

export interface Polyline {
    /** Array of latitudes. */
    lat: number[]
    /** Array of longitudes. */
    lng: number[]
    /** Array of distances. */
    dis?: number[]
    /** Colors of the main line. */
    colors?: string[]
    /** Thickness of the main line. */
    thickness?: number
    /** Colors of the shadow. */
    backgrounds?: string[]
    /** Thickness of the shadow. */
    shadow?: number
    /**
     * Pattern of dashes and gaps used to paint the outline of the shape
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
     */
    dashArray?: string
}

const SECTIONS = 24
const DEFAULT_BACK_COLORS = ["#080", "#880", "#800"]
const DEFAULT_FORE_COLORS = ["#0f0", "#ff0", "#f00"]

export default class PopupManager {
    private nextId = 1
    private polylines = new Map<number, Leaf.Polyline[]>()

    constructor(private readonly map: Leaf.Map) {}

    clear() {
        const ids = Array.from(this.polylines.keys())
        for (const id of ids) {
            this.remove(id)
        }
    }

    add(polyline: Polyline): number {
        const id = this.nextId++
        const { map } = this
        const polylines: Leaf.Polyline[] = []
        const dis: number[] =
            polyline.dis ?? computeDistances(polyline.lat, polyline.lng)
        const background: string[] = smoothColors(
            polyline.backgrounds ?? DEFAULT_BACK_COLORS
        )
        createSections(
            computeSectionRanges(dis, background.length),
            polyline,
            background,
            polyline.shadow ?? 6,
            map,
            polylines
        )
        const foreground: string[] = smoothColors(
            polyline.colors ?? DEFAULT_FORE_COLORS
        )
        createSections(
            computeSectionRanges(dis, foreground.length),
            polyline,
            foreground,
            polyline.thickness ?? 3,
            map,
            polylines
        )
        this.polylines.set(id, polylines)
        return id
    }

    remove(id: number) {
        const polylines = this.polylines.get(id)
        if (!polylines) return

        const { map } = this
        for (const polyline of polylines) {
            polyline.removeFrom(map)
        }
        this.polylines.delete(id)
    }
}

function createSections(
    ranges: number[],
    trace: Polyline,
    colors: string[],
    thickness: number,
    map: Leaf.Map,
    polylines: Leaf.Polyline[]
) {
    for (let idx = 0; idx < ranges.length - 1; idx++) {
        const begin = ranges[idx]
        const end = ranges[idx + 1] + 1
        const lats = trace.lat.slice(begin, end)
        const lngs = trace.lng.slice(begin, end)
        const polyline = new Leaf.Polyline(
            convertPoints({ lat: lats, lng: lngs }),
            {
                color: colors[idx],
                weight: thickness,
                dashArray: trace.dashArray,
            }
        )
        polyline.addTo(map)
        polylines.push(polyline)
    }
}

function convertPoints(polyline: Polyline): Leaf.LatLngExpression[] {
    const points: Leaf.LatLngExpression[] = []
    const lats = polyline.lat
    const lngs = polyline.lng
    for (let idx = 0; idx < lats.length; idx++) {
        points.push([lats[idx], lngs[idx]])
    }
    return points
}

/**
 * Compute approximative distances used for sections.
 * We don't compute real distances for performance sake.
 */
function computeDistances(lat: number[], lng: number[]): number[] {
    const dis = [0]
    for (let k = 1; k < lat.length; k++) {
        const lat0 = lat[k - 1]
        const lng0 = lng[k - 1]
        const lat1 = lat[k]
        const lng1 = lng[k]
        dis.push(
            dis[k - 1] + Math.max(Math.abs(lat1 - lat0), Math.abs(lng1 - lng0))
        )
    }
    return dis
}

/**
 * If nbSections === n, then the resulting array will have n+1 elements.
 */
function computeSectionRanges(
    disArray: number[],
    nbSections: number
): number[] {
    const lastIndex = disArray.length - 1
    if (nbSections < 2) return [0, lastIndex]

    const totalDis = disArray[lastIndex]
    const sectionDis = totalDis / Math.min(nbSections, disArray.length)
    const sections = [0]
    let nextStep = sectionDis

    for (let index = 0; index <= lastIndex; index++) {
        const dis = disArray[index]
        if (dis < nextStep) continue
        nextStep += sectionDis
        sections.push(index)
    }
    sections.push(lastIndex)

    return sections
}

function smoothColors(steps: string[]): string[] {
    if (steps.length < 2) return steps

    return Color.interpolate(steps, SECTIONS).map(c => c.stringify())
}
