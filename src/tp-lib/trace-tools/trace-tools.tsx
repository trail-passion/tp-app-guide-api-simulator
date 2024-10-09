import castArray from "../tools/converter/array"
import castFloat from "../tools/converter/double"
import castInteger from "../tools/converter/integer"
import castStringArray from "../tools/converter/string-array"
import findPeaks from "./find-peaks"
import normalizeTourism from "./normalize-tourism"
import {
    IBounds,
    IMarker,
    IPoiMarker,
    ISecondaryTrace,
    IStepMarker,
    TraceFile,
} from "tp-lib/types"
import { isTraceFile } from "tp-lib/trace-manager/validator"
import { isNumber } from "tp-lib/tools/type-guards"

const ATTRIBUTES_FOR_POINTS = ["lat", "lng", "alt", "dis", "tim", "hrt", "acc"]
const KEYS_ARRAY = ["lat", "lng", "alt"]

// Conversions factors.
const M_TO_KM = 0.001
const KM_TO_M = 1000
const UNZIP_FACTOR = 0.000001
const ZIP_FACTOR = KM_TO_M * KM_TO_M
const TO_PERCENT = 0.01

const DEFAULT_ELEVATION_THRESHOLD = 15
const MIN_LAT = -180
const MAX_LAT = 180
const MIN_LNG = -360
const MAX_LNG = 360
const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600
const HALF_TURN_IN_DEGREE = 180

interface IUntyped {
    [key: string]: any
}

export interface AscDscType {
    asc: number[]
    dsc: number[]
}

export default {
    ATTRIBUTES_FOR_POINTS,
    areAlmostEqual,
    boundsUnion,
    bounds,
    isLoop,
    findPeaks,
    findNearestPoints,
    normalize,
    simplify,
    parseLatOrLng,
    parseLat: parseLatOrLng,
    parseLng: parseLatOrLng,
    listAllImages,
    sortMarkers,
    findMarkerByIdx,
    addFirstAndLastMarkers,
    computeAscDsc,
    fastAscDsc,
    computeCumulatedElevation,
    reverse,
    concat,
    copy,
    getPseudoDis,
    computeTimes,
    computeDis,
    distance,
    mrkImgSrc,
    computeAltByDis,
    fairSplit,
    dis2idx,
    tim2idx,
    unzip,
    zip,
}

/**
 * Modify a trace to make it respectful of the standards.
 */
function normalize(data: TraceFile): TraceFile {
    // Unzip if necessary.
    unzip(data)

    const ascdsc = computeAscDsc(data)

    normalizeLatLng(data)
    normalizeDate(data)
    normalizeLoops(data)
    normalizeLogo(data)
    normalizeProfil(data)
    normalizeTourism(data)
    if (!normalizeDistances(data)) throw Error("Unable to retrieve distances!")
    normalizeLevel(data)
    normalizeAltitudes(data)
    normalizeThreshold(data)
    normalizeKilometers(data)
    normalizeAscDsc(data, ascdsc)
    normalizeSteps(data, ascdsc)
    normalizePoi(data)
    normalizeMarkers(data)
    normalizeChildren(data)
    removePrivateAttributes(data)

    return data
}

function removePrivateAttributes(data: IUntyped) {
    const attribNames = Object.keys(data)
    attribNames.forEach(function (attName) {
        if (attName.charAt(0) === "_") delete data[attName]
    })
}

function normalizeLatLng(data: TraceFile) {
    if (!Array.isArray(data.lat)) data.lat = []
    if (!Array.isArray(data.lng)) data.lng = []
}

function normalizeDate(data: TraceFile) {}

function normalizeLoops(data: TraceFile) {
    const loops = castInteger(data.loops)
    if (isNaN(loops) || loops < 1) data.loops = 1
}

function normalizeLogo(data: TraceFile) {
    if (typeof data.logo !== "string" || data.logo.trim().length === 0) {
        data.logo = `tfw/pub/preview/${data.id}-fb.jpg`
    }
}

/**
 * data.children must be an array.
 */
function normalizeChildren(data: TraceFile) {
    if (!Array.isArray(data.children)) data.children = []
    if (!Array.isArray(data.switches)) data.switches = []
}

/**
 * By default the mini-profil is visible.
 */
function normalizeProfil(data: TraceFile) {
    data.profil = typeof data.profil === "boolean" ? data.profil : true
}

function normalizeDistances(data: TraceFile): data is TraceFile {
    // Computing distances.
    if (!Array.isArray(data.dis) || data.dis.length !== data.lat.length) {
        computeDis(data)
    }
    return true
}

/**
 * Must be called after normalizedDistances.
 */
function normalizeKilometers(data: TraceFile) {
    if (!Array.isArray(data.dis)) return

    // Computing total KM.
    data.km = castFloat(data.km)
    if (isNaN(data.km) || data.km <= 0) {
        data.km = (data.dis[data.dis.length - 1] - data.dis[0]) * M_TO_KM
    }
}

function normalizeLevel(data: TraceFile) {
    if (typeof data.level === "undefined") data.level = 0
    else {
        data.level = castInteger(data.level)
        if (isNaN(data.level)) data.level = 0
    }
}

function normalizeThreshold(data: TraceFile) {
    data.thr = castInteger(data.thr)
    if (isNaN(data.thr)) data.thr = DEFAULT_ELEVATION_THRESHOLD
}

function normalizeAscDsc(
    data: TraceFile,
    ascdsc: { asc: number[]; dsc: number[] }
) {
    // Computing total D+/D-.
    data.asc = castInteger(data.asc, 0)
    data.dsc = castInteger(data.dsc, 0)
    if (isNaN(data.asc) || isNaN(data.dsc) || data.asc <= 0 || data.dsc <= 0) {
        data.asc = castInteger(ascdsc.asc[ascdsc.asc.length - 1], 0)
        data.dsc = castInteger(ascdsc.dsc[ascdsc.dsc.length - 1], 0)
    }
}

function normalizeSteps(
    data: TraceFile,
    ascdsc: { asc: number[]; dsc: number[] }
) {
    // Sorting and normalizing markers.
    sortMarkers(data)
    castArray(data.text).forEach(function (mrk) {
        if (typeof mrk.idx !== "number") {
            mrk.idx = castInteger(mrk.idx)
        }
        // Store D+/D- for each marker.
        mrk.asc = ascdsc.asc[mrk.idx]
        mrk.dsc = ascdsc.dsc[mrk.idx]

        if (typeof mrk.img === "string") {
            // In older versions,  icons where stored in  a string and
            // not in an array as today.
            mrk.img = text2array(mrk.img)
        }
    })
}

function normalizePoi(data: TraceFile) {
    if (!Array.isArray(data.poi)) data.poi = []
    if (data.poi.length === 0) return
    if (data.lat.length > 0) return
    let lat = 0
    let lng = 0
    data.poi.forEach((poi) => {
        lat += castFloat(poi.lat)
        lng += castFloat(poi.lng)
    })
    lat /= data.poi.length
    lng /= data.poi.length
    data.lat = [lat]
    data.lng = [lng]
}

function normalizeMarkers(trace: TraceFile) {
    const hasSteps = Array.isArray(trace.text) && trace.text.length > 0
    const hasPOIs = Array.isArray(trace.poi) && trace.poi.length > 0
    const hasMarkers = Array.isArray(trace.markers) && trace.markers.length > 0
    if (!hasSteps && !hasPOIs && hasMarkers) return
    trace.icons = []
    trace.markers = []
    if (hasSteps) {
        const markersFromSteps: IMarker[] = (trace.text as IStepMarker[]).map(
            (step: IStepMarker) => ({
                ...step,
                lat: trace.lat[step.idx],
                lng: trace.lng[step.idx],
                ico: castStringArray(step.img, []).map((imgDef) =>
                    getIconIndex(trace, mrkImgSrc(trace, imgDef) ?? "")
                ),
            })
        )
        trace.markers.push(...markersFromSteps)
        delete trace.text
    }
    if (hasPOIs) {
        const markersFromPois: IMarker[] = (trace.poi as IPoiMarker[]).map(
            (poi: IPoiMarker) => {
                return {
                    ...poi,
                    ico: [
                        getIconIndex(trace, mrkImgSrc(trace, poi.icon) ?? ""),
                    ],
                }
            }
        )
        trace.markers.push(...markersFromPois)
        delete trace.poi
    }
    trace.icons = trace.icons.map((url) =>
        url.startsWith("css/") ? `https://trail-passion.net/${url}` : url
    )
}

/**
 * `trace.icons` stored the URL or DataURI of the icons used in the markers.
 * Then, in `trace.markers`, the attribute `ico` is an array of indexes on `trace.icons`.
 * This is usefull to reduce the size of the map when many markers display the
 * same icon.
 * This function look in `trace.icons` for an `iconUrl` and return its index.
 * If it cannot find it, the `iconUrl` is added to `trace.icons` and its index
 * id returned.
 */
function getIconIndex(trace: TraceFile, iconUrl: string): number {
    if (!Array.isArray(trace.icons)) trace.icons = []
    if (iconUrl.startsWith("tfw/")) {
        iconUrl = `/${iconUrl}`
    }
    const index = trace.icons.indexOf(iconUrl)
    if (index !== -1) return index
    trace.icons.push(iconUrl)
    return trace.icons.length - 1
}

function sortMarkers(data: TraceFile) {
    if (!Array.isArray(data.text)) data.text = []
    data.text.sort(function (a, b) {
        return a.idx - b.idx
    })
    // Removing duplicates.
    const markers: IStepMarker[] = []
    let lastIdx = -1
    data.text.forEach(function (mrk) {
        if (typeof mrk.idx !== "number") {
            mrk.idx = castInteger(mrk.idx, 0)
        }
        if (!isNaN(mrk.idx) && lastIdx !== mrk.idx) {
            lastIdx = mrk.idx
            markers.push(mrk)
        }
    })
    data.text = markers
}

/**
 * Altitudes are not always all numbers. It can happen that few values are `null` or zero.
 * In this case, we must interpolate with surrouding correct values.
 */
function normalizeAltitudes(data: TraceFile) {
    if (!Array.isArray(data.alt) || data.alt.length !== data.lng.length) {
        delete data.alt
        return
    }

    // Last point to be a correct altitude.
    let lastAlt = 0
    let lastIdx = 0
    // 0: waiting for first NaN.
    // 1: waiting for first correct number
    let state = 0
    const ALT: number[] = Array.isArray(data.alt) ? data.alt : []
    const DIS = Array.isArray(data.alt) ? data.alt : []

    ALT.forEach(function (rawAltitude, idx) {
        // Try to convert altitude into number.
        const alt = castInteger(rawAltitude, 0)
        // Index for interpolation.
        let k = 0
        // We use a linear interpolation based on distance.
        // Distance of the first correct point.
        let dis0 = 0
        // Distance between the two correct points.
        let disDelta = 0
        // Altitude between the two correct points.
        let altDelta = 0
        // Store it again in the array to remove floats.
        ALT[idx] = alt
        if (state === 0) {
            // Last point was a correct altitude.
            if (isNaN(alt) || alt < 0) {
                state = 1
            } else {
                lastAlt = alt
                lastIdx = idx
            }
        } else {
            // Last point is bad.
            if (!isNaN(alt) && alt >= 0) {
                // Let's interpolate.
                dis0 = DIS[lastIdx]
                // The max is  used to prevent division  by zero. We
                // assume there  is always at least  1 meter between
                // two points.
                disDelta = Math.max(1, DIS[idx] - dis0)
                altDelta = alt - lastAlt
                for (k = lastIdx + 1; k < idx; k++) {
                    ALT[k] = round(
                        lastAlt + (altDelta * (DIS[k] - dis0)) / disDelta
                    )
                }
                // Return to the default mode.
                lastAlt = alt
                lastIdx = idx
                state = 0
            }
        }
    })
    const MIN_ALTITUDES_NEEDED_FOR_PROFIL = 3
    if (ALT.length < MIN_ALTITUDES_NEEDED_FOR_PROFIL) data.profil = false
    // S'il manque trop d'altitudes, on n'affiche pas de mini-profil.
    const BAD_ALTITUDES_THRESHOLD = 0.7
    if (countBadAltitudes(ALT) > BAD_ALTITUDES_THRESHOLD * ALT.length) {
        data.profil = false
    }
}

function countBadAltitudes(altitudes: number[]) {
    let badAltitudes = 0
    for (const alt of altitudes) {
        if (alt === -1) badAltitudes++
    }
    return badAltitudes
}

/**
 * Find the bounds of a trace.
 */
function bounds(data: {
    dis?: number[]
    lat: number[]
    lng: number[]
    alt?: number[]
    markers?: IMarker[]
    children?: ISecondaryTrace[]
}): IBounds {
    const b = {
        e: -180,
        w: 180,
        n: -90,
        s: 90,
        altMin: 10000,
        altMax: -10000,
        disMin: Number.MAX_SAFE_INTEGER,
        disMax: -Number.MAX_SAFE_INTEGER,
    }
    if (Array.isArray(data.dis)) {
        b.disMin = data.dis[0]
        b.disMax = data.dis[data.dis.length - 1]
    }

    const altitudes = castArray(data.alt)

    if (Array.isArray(data.lat) && Array.isArray(data.lng)) {
        for (let i = 0; i < data.lat.length; i++) {
            const lat = data.lat[i]
            const lng = data.lng[i]
            const alt = altitudes[i]
            b.n = Math.max(b.n, lat)
            b.s = Math.min(b.s, lat)
            b.e = Math.max(b.e, lng)
            b.w = Math.min(b.w, lng)
            b.altMax = Math.max(b.altMax, alt)
            b.altMin = Math.min(b.altMin, alt)
        }
    }
    // Il faut maintenant inclure les POIs.
    addPoisToBound(b, castArray(data.markers))

    addChildrenToBound(b, castArray(data.children))

    return b
}

/**
 * Add secondary traces into bounds.
 */
function addChildrenToBound(boundary: IBounds, children: ISecondaryTrace[]) {
    if (!Array.isArray(children)) return
    children.forEach(function (child) {
        const b = child.bounds
        boundary.n = Math.max(boundary.n, b.n)
        boundary.s = Math.min(boundary.s, b.s)
        boundary.e = Math.max(boundary.e, b.e)
        boundary.w = Math.min(boundary.w, b.w)
    })
}

/**
 * Include POIs into bounds.
 */
function addPoisToBound(boundary: IBounds, markers: IMarker[]) {
    if (!Array.isArray(markers)) return

    for (const mrk of markers) {
        const { lat, lng, idx } = mrk
        if (
            typeof idx === "number" ||
            !isNumber(lat) ||
            isNaN(lat) ||
            !isNumber(lng) ||
            isNaN(lng)
        )
            continue
        if (lat < MIN_LAT || lat > MAX_LAT) {
            console.error("Bad latitude: ", lat)
            continue
        }
        if (lng < MIN_LNG || lng > MAX_LNG) {
            console.error("Bad longitude: ", lng)
            continue
        }

        boundary.n = Math.max(boundary.n, lat)
        boundary.s = Math.min(boundary.s, lat)
        boundary.e = Math.max(boundary.e, lng)
        boundary.w = Math.min(boundary.w, lng)
    }
}

/**
 * Default threshold is DEFAULT_ELEVATION_THRESHOLD.
 * But we always try to the one defined in the trace.
 */
function computeAscDsc(
    data: TraceFile,
    from: number = 0,
    to: number = -1
): AscDscType {
    const d = data
    if (!Array.isArray(d.alt)) d.alt = []
    const result: { asc: number[]; dsc: number[] } = {
        asc: [],
        dsc: [],
    }
    let a = from
    let b = to
    if (a < 0) a = 0
    if (b === -1) b = d.alt.length - 1
    if (b >= d.alt.length) b = d.alt.length - 1
    if (a >= b) return result
    let threshold = castInteger(data.thr, DEFAULT_ELEVATION_THRESHOLD)
    if (isNaN(threshold)) threshold = DEFAULT_ELEVATION_THRESHOLD
    threshold = Math.max(1, threshold)
    let alt = d.alt[a]
    let lastIdx = a
    let asc = 0
    let dsc = 0
    result.asc.push(0)
    result.dsc.push(0)
    for (let i = a + 1; i < b + 1; i++) {
        let cur = d.alt[i]
        if (isNaN(cur)) {
            cur = castInteger(cur)
            if (isNaN(cur)) {
                // If  a value  is NaN,  we must  ignore it  to preserve
                // computing correctness.
                result.asc.push(asc)
                result.dsc.push(dsc)
                continue
            }
        }
        const delta = cur - alt
        let change = 0
        if (delta > threshold) {
            // Montée détectée.
            asc += delta
            alt = cur
            change = 1
        } else if (delta < -threshold) {
            // Descente détectée.
            dsc -= delta
            alt = cur
            change = -1
        }
        result.asc.push(asc)
        result.dsc.push(dsc)
        if (change > 0) {
            linearize(result.asc, lastIdx, i)
            lastIdx = i
        } else if (change < 0) {
            linearize(result.dsc, lastIdx, i)
            lastIdx = i
        }
    }
    return result
}

/**
 * Reverse a  trace. The start becomes  the end and the  end becomes the
 * start.
 */
function reverse(data: TraceFile) {
    const dataAny = data as IUntyped
    KEYS_ARRAY.forEach(function (key) {
        const arr = dataAny[key]
        if (Array.isArray(arr)) {
            arr.reverse()
        }
    })
    const tmp = data.asc
    data.asc = data.dsc
    data.dsc = tmp
    const size = data.lat.length - 1
    if (Array.isArray(data.text)) {
        data.text.forEach((mrk: IMarker) => {
            const idx = size - castInteger(mrk.idx)
            mrk.idx = idx
        })
    }
    delete data.tim
    delete data.dis
    return normalize(data)
}

/**
 * Add `data2` to the end of `data1`.
 */
function concat(data1: TraceFile, data2: TraceFile): TraceFile {
    const size = data1.lat.length

    const d1 = data1 as IUntyped
    const d2 = data2 as IUntyped

    KEYS_ARRAY.forEach(function (key) {
        const arr1 = d1[key]
        const arr2 = d2[key]
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            delete d1[key]
            delete d2[key]
        } else {
            arr2.forEach(function (itm) {
                arr1.push(itm)
            })
        }
    })
    if (!Array.isArray(data1.text)) {
        data1.text = []
    }
    if (Array.isArray(data2.text)) {
        data2.text.forEach(function (rawMrk) {
            const mrk = JSON.parse(JSON.stringify(rawMrk))
            const idx = size + castInteger(mrk.idx)
            mrk.idx = idx
            ;(data1.text as IStepMarker[]).push(mrk)
        })
    }
    ;["km", "asc", "dsc"].forEach(function (key) {
        const arr1 = d1[key]
        const arr2 = d2[key]
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            delete d1[key]
            delete d2[key]
        } else {
            d1[key] = castInteger(d1[key]) + castInteger(d2[key])
        }
    })

    delete data1.tim
    delete data1.dis
    return normalize(data1)
}

/**
 * Shallow copy of a trace.
 */
function copy(data: TraceFile) {
    return JSON.parse(JSON.stringify(data))
}

const MIN_SPEED = 2.6
const FLAT_SPEED = 8 // 8 km/h when it's flat.
const FLAT_THRESHOLD = 0.08
const BIG_ASC = 0.27 // Une pente de 0.27 équivaut à la montée de Grande-Gorge.
const BIG_ASC_SPEED = 3 // Et il faut compter 3 km/h.

/**
 * Calcule la vitesse de course sur la portion montante [a, b] de la trace.
 */
function speedUp(data: TraceFile, speeds: number[], a: number, b: number) {
    const dis = castArray(data.dis)
    const alt = castArray(data.alt)
    const m = dis[b] - dis[a] // Taille du tronçon en mètres.
    const d = alt[b] - alt[a] // Dénivelé du tronçon.
    const x = castFloat(d) / castFloat(m)
    let s = FLAT_SPEED // 8 km/h sur le plat.
    if (x > FLAT_THRESHOLD) {
        // Il ne s'agit plus de plat.
        s =
            FLAT_SPEED +
            ((BIG_ASC_SPEED - FLAT_SPEED) * (x - FLAT_THRESHOLD)) /
                (BIG_ASC - FLAT_THRESHOLD)
    }
    speeds.push(Math.max(MIN_SPEED, s))
}

const FAST_DSC_SLOPE = 0.12
const FAST_DSC_SPEED = 13
const HARD_DSC_SLOPE = 0.22 // Une pente de 0.22 équivaut à la descente d'Orjobet.
const HARD_DSC_SPEED = 8 // Et il faut compter 8 km/h.
/**
 * Calcule la vitesse de course sur la portion Descendante [a, b] de la trace.
 */
function speedDown(data: TraceFile, speeds: number[], a: number, b: number) {
    const dis = castArray(data.dis)
    const alt = castArray(data.alt)
    const m = dis[b] - dis[a] // Taille du tronçon en mètres.
    const d = alt[a] - alt[b] // Dénivelé du tronçon.
    const x = castFloat(d) / castFloat(m)
    let s = FLAT_SPEED // 8 km/h sur le plat.
    if (x > FLAT_THRESHOLD) {
        // Il ne s'agit plus de plat.
        if (x < FAST_DSC_SLOPE) {
            // Jusqu'à une pente de 0.12, on accélère pour atteindre 13 km/h.
            s =
                FLAT_SPEED +
                ((FAST_DSC_SPEED - FLAT_SPEED) * (x - FLAT_THRESHOLD)) /
                    (FAST_DSC_SLOPE - FLAT_THRESHOLD)
        } else {
            // Une pente de 0.22 équivaut à la descente d'Orjobet
            // et il faut compter 8 km/h.
            s =
                FAST_DSC_SPEED +
                ((HARD_DSC_SPEED - FAST_DSC_SPEED) * (x - FAST_DSC_SLOPE)) /
                    (HARD_DSC_SLOPE - FAST_DSC_SLOPE)
        }
    }
    speeds.push(Math.max(MIN_SPEED, s))
}

/**
 * Return relative speeds by steps. `{steps: [], speeds: []}`
 * * __steps__: Each item is a step and it is represented by the index of the last point of this step.
 * * __speeds__: Array of same length as `steps`. Relative speed of each step.
 */
function computeSpeedsByStep(data: TraceFile) {
    const speeds: number[] = []
    const altitudes = castArray(data.alt)
    const distances = castArray(data.dis)

    // On considère des étapes par seuils de 20 mètres de dénivelé.
    // C'est pour calculer les pentes sur des portions assez grandes.
    const threshold = castInteger(data.thr, DEFAULT_ELEVATION_THRESHOLD)
    let lastAlt = altitudes[0]
    let lastIdx = 0
    const steps: number[] = []
    let z = 0
    for (let i = 0; i < distances.length; i++) {
        const a = castInteger(altitudes[i])
        z = a - lastAlt
        if (z > threshold) {
            // Dénivelé positif.
            speedUp(data, speeds, lastIdx, i)
            lastIdx = i
            lastAlt = a
            steps.push(castInteger(i, 0))
        } else if (-z > threshold) {
            // Dénivelé négatif.
            speedDown(data, speeds, lastIdx, i)
            lastIdx = i
            lastAlt = a
            steps.push(castInteger(i, 0))
        }
    }
    // Dernier tronçon.
    if (z > 0) {
        // Dénivelé positif.
        speedUp(data, speeds, lastIdx, distances.length - 1)
        steps.push(distances.length - 1)
    } else if (z <= 0) {
        // Dénivelé négatif.
        speedDown(data, speeds, lastIdx, distances.length - 1)
        steps.push(distances.length - 1)
    }

    return { steps, speeds }
}

/**
 * Convert  kilometers in  pseudo-kilometers. A  km in  a big  ascending
 * slope gives a greater pseudo-km.
 *
 * Returns pseudo kilometers per point.
 */
function getPseudoDis(data: TraceFile) {
    const dis = [0]
    const speedsByStep = computeSpeedsByStep(data)
    const steps = speedsByStep.steps
    const speeds = speedsByStep.speeds

    const distances = castArray(data.dis)
    let lastIdx = 0
    steps.forEach(function (idx, i) {
        // Vitesse sur le tronçon.
        const speed = speeds[i]
        // Appliquer des temps théoriques.
        let k = lastIdx + 1
        while (k <= idx) {
            dis.push(
                dis[lastIdx] +
                    (castInteger(distances[k], 0) -
                        castInteger(distances[lastIdx], 0)) /
                        speed
            )
            k++
        }
        lastIdx = idx
    })

    return dis
}

/**
 * Change the times to simulate a real journey.
 * @param data 3d GPS position (lat, lng, ele).
 * @param start Start time in minutes from midnight.
 * @param rawDuration Duration in minutes.
 * @param rawTireness Percentage from -99 to 100.
 */
function computeTimes(
    data: TraceFile,
    start: number,
    rawDuration: number,
    rawTireness: number
) {
    const tim = [0] // Resulting array of times expressed in seconds
    let pause = 0 // Total pausing time in minutes.
    let duration = rawDuration

    if (data.text) {
        // Ajouter les éventuels temps de pause pour chaque ravito.
        // Ces temps de pause sont exprimés en minutes.
        for (const mrk of data.text) {
            if (mrk.pau) {
                pause += castInteger(mrk.pau)
            }
        }
        duration -= pause
    }
    const tireness = rawTireness * TO_PERCENT

    // Recalculer les distances pour être sûr.
    let lastLat = data.lat[0]
    let lastLng = data.lng[0]
    if (!data.dis) {
        // Pas de distance, alors on la calcule.
        data.dis = [0]
        let dis = 0
        for (let index = 1; index < data.lat.length; index++) {
            const lat = data.lat[index]
            const lng = data.lng[index]
            dis += distance(lastLat, lastLng, lat, lng)
            data.dis.push(dis)
            lastLat = lat
            lastLng = lng
        }
    }

    const distances = castArray(data.dis)

    const speedsByStep = computeSpeedsByStep(data)
    const steps = speedsByStep.steps
    const speeds = speedsByStep.speeds
    const totalDis = data.dis[data.dis.length - 1] - data.dis[0]
    let lastIdx = 0
    steps.forEach(function (idx, speedIndex) {
        // Vitesse sur le tronçon.
        let speed = speeds[speedIndex]
        // Calcul de la fatigue.
        speed *= 1 - (tireness * distances[idx]) / totalDis
        // Appliquer des temps théoriques.
        let k = lastIdx + 1
        while (k <= idx) {
            tim.push(
                tim[lastIdx] +
                    Math.ceil(
                        (castInteger(distances[k]) -
                            castInteger(distances[lastIdx])) /
                            speed
                    )
            )
            k++
        }
        lastIdx = idx
    })

    // Maintenant on dilate/contracte pour obtenir le temps voulu.
    const base = start * SECONDS_PER_MINUTE
    const factor = (duration * SECONDS_PER_MINUTE) / tim[tim.length - 1]

    for (let i = 0; i < tim.length; i++) {
        tim[i] = base + Math.floor(factor * tim[i])
    }

    // Pour finir, il faut insérer les temps de pause.
    const pauses: number[][] = []
    pause = 0
    for (const item of castArray(data.text)) {
        if (item.pau) {
            pause += castInteger(item.pau) * SECONDS_PER_MINUTE
            pauses.push([item.idx + 1, pause])
        }
    }
    if (pauses.length > 0) {
        pauses.push([tim.length])
        for (let idxTxt = 0; idxTxt < pauses.length - 1; idxTxt++) {
            const begin = pauses[idxTxt]
            const end = pauses[idxTxt + 1]
            for (let i = begin[0]; i < end[0]; i++) {
                tim[i] += begin[1]
            }
        }
    }

    return tim
}

/**
 * Calcule la distance  en mètres entre deux points dont  on donne les
 * coordonnées latitude/longitude/altitude en argument.
 * Two possible calls:
 * 1) `distance( lat1, lng1, lat2, lng2 )`
 * 2) `distance( lat1, lng1, alt1, lat2, lng2, alt2 )`
 */
function distance(...args: number[]) {
    const MAX_NB_ARGS = 6
    const LAT1_IDX = 0
    const LNG1_IDX = 1
    const LAT2_IDX = 2
    const LNG2_IDX = 3
    const ALT1_IDX = 2
    const ALT2_IDX = 5
    const LAT2_IDX_CASE2 = 3
    const LNG2_IDX_CASE2 = 4
    const sixArgs = args.length >= MAX_NB_ARGS
    const lat1 = args[LAT1_IDX]
    const lng1 = args[LNG1_IDX]
    const alt1 = sixArgs ? args[ALT1_IDX] : 0
    const lat2 = sixArgs ? args[LAT2_IDX_CASE2] : args[LAT2_IDX]
    const lng2 = sixArgs ? args[LNG2_IDX_CASE2] : args[LNG2_IDX]
    const alt2 = sixArgs ? args[ALT2_IDX] : 0
    // Equatorial radius.
    const Re = 6378137
    // Pole radius.
    const Rp = 6356752.3
    // Radians conversion.
    const radians = Math.PI / HALF_TURN_IN_DEGREE
    const lat1rad = lat1 * radians
    const lng1rad = lng1 * radians
    const lat2rad = lat2 * radians
    const lng2rad = lng2 * radians

    const r1 = (Re + alt1) * Math.cos(lat1rad)
    const z1 = (Rp + alt1) * Math.sin(lat1rad)
    const x1 = r1 * Math.cos(lng1rad)
    const y1 = r1 * Math.sin(lng1rad)
    const r2 = (Re + alt2) * Math.cos(lat2rad)
    const z2 = (Rp + alt2) * Math.sin(lat2rad)
    const x2 = r2 * Math.cos(lng2rad)
    const y2 = r2 * Math.sin(lng2rad)

    const x = x1 - x2
    const y = y1 - y2
    const z = z1 - z2

    return Math.sqrt(x * x + y * y + z * z)
}

/**
 * There are common and custom icons.
 * Custom icons are represented by a lowercase letter.
 */
function mrkImgSrc(data: TraceFile, code: any): string | undefined {
    const codeText = `${code}`.trim()
    if (codeText.length === 0) return undefined
    if (codeText.startsWith("http:")) return codeText
    if (codeText.startsWith("https:")) return codeText
    if (codeText.startsWith("data:")) return codeText

    const firstChar = codeText.charAt(0)
    if (firstChar >= "0" && firstChar <= "9") {
        // `code` is "<usr>/<icon>".
        const [first] = codeText.split(",")
        return `tfw/pub/icons/${data.usr}/${first}.png`
    }
    return `css/gfx/ravitos/${
        codeText.length === 1 ? "mrk-" : ""
    }${codeText}.png`
}

function computeAltByDis(
    data: TraceFile,
    size: number,
    from: number = -1,
    to: number = -1
) {
    const distances = castArray(data.dis)
    const altitudes = castArray(data.alt)

    const startDis = from < 0 ? 0 : from
    const endDis = to < 0 ? distances[distances.length - 1] : to
    const result = [altitudes[0]]
    const step = (endDis - startDis) / (round(size) - 1)
    let idxAlt = 0
    for (let idxResult = 1; idxResult < size; idxResult++) {
        const currentDis = startDis + step * idxResult
        // idxAlt is the index of the first point just after the current distance.
        while (idxAlt < distances.length && distances[idxAlt] < currentDis) {
            idxAlt++
        }
        const dis0 = distances[idxAlt - 1]
        const dis1 = distances[idxAlt]
        const alt0 = altitudes[idxAlt - 1]
        const alt1 = altitudes[idxAlt]
        result.push(
            alt0 + (alt1 - alt0) * (1 - (dis1 - currentDis) / (dis1 - dis0))
        )
    }
    return result
}

/**
 * Return the index of the nearest point to `dis`.
 */
function dis2idx(data: TraceFile, dis: number) {
    // Check inputs.
    if (!data || !Array.isArray(data.dis)) {
        console.info("[tp4.trace-tools] data=", data)
        console.info("[tp4.trace-tools] dis=", dis)
        throw Error(
            "Argument `data` must be an object with an array attribute `dis`!"
        )
    }

    // Just a shortcut to the distances array.
    const D = data.dis
    // Number of elements.
    const n = D.length
    // Lower bound of the search window.
    let a = 0
    // Higher bound of the search window.
    let b = n - 1
    while (b - a > 1) {
        const m = Math.floor(average(a, b))
        if (D[m] > dis) {
            b = m
        } else {
            a = m
        }
    }

    if (dis - D[a] < D[b] - dis) return a
    return b
}

// Dichotomic search.
function tim2idx(data: TraceFile, tim: number, from: number, to: number) {
    // Check inputs.
    if (!data || !Array.isArray(data.tim)) {
        console.info("[tp/trace-tools/tim2idx] data=", data)
        console.info("[tp/trace-tools/tim2idx] tim=", tim)
        throw Error(
            "Argument `data` must be an object with an array attribute `tim`!"
        )
    }

    let a = from
    let b = to
    // Just a shortcut to the distances array.
    const T = data.tim
    // Number of elements.
    const n = T.length
    // Lower bound of the search window.
    if (typeof a === "undefined") a = 0
    // Higher bound of the search window.
    if (typeof b === "undefined") b = n - 1
    while (b - a > 1) {
        const m = Math.floor(average(a, b))
        if (T[m] > tim) {
            b = m
        } else {
            a = m
        }
    }

    if (tim - T[a] < T[b] - tim) return a
    return b
}

/**
 * Remove useless points.
 */
function simplify(data: TraceFile) {
    return data
}

/**
 * Unzip the trace if and only if it's `zip` attribute is equal to 1.
 */
function unzip(data: TraceFile) {
    const zipMode = data.zip ?? 0
    if (zipMode !== 1) return false

    const d = data as IUntyped
    for (const att of ["alt", "dis", "tim", "hrt", "acc"]) {
        const arr = d[att]
        if (!Array.isArray(arr)) continue
        let accumulator = 0
        arr.forEach(function (value, idx) {
            accumulator += value
            arr[idx] = accumulator
        })
    }
    for (const att of ["lat", "lng", "lon"]) {
        const arr = d[att]
        if (!Array.isArray(arr)) continue
        let accumulator = 0
        arr.forEach(function (value, idx) {
            accumulator += value
            arr[idx] = accumulator * UNZIP_FACTOR
        })
    }

    data.zip = 0
    return true
}

function zip(data: TraceFile, algo: number = 1): TraceFile {
    unzip(data)

    const d = data as IUntyped
    for (const att of ["alt", "dis", "tim", "hrt", "acc"]) {
        const arr = d[att]
        if (!Array.isArray(arr) || arr.length === 0) {
            continue
        }
        arr[0] = Math.floor(arr[0])
        let lastValue = arr[0]
        for (let i = 1; i < arr.length; i++) {
            const currentValue = Math.floor(arr[i])
            arr[i] = currentValue - lastValue
            lastValue = currentValue
        }
    }
    for (const att of ["lat", "lng", "lon"]) {
        const arr = d[att]
        if (!Array.isArray(arr) || arr.length === 0) break
        arr[0] = round(arr[0] * ZIP_FACTOR)
        let lastValue = arr[0]
        for (let i = 1; i < arr.length; i++) {
            arr[i] = round(arr[i] * ZIP_FACTOR)
            const currentValue = arr[i]
            arr[i] -= lastValue
            lastValue = currentValue
        }
    }

    data.zip = algo
    return data
}

function addFirstAndLastMarkers(trace: TraceFile) {
    const markers = castArray(trace.text)
    if (markers.length === 0 || castInteger(markers[0].idx) > 0) {
        const firstMarker: IStepMarker = {
            idx: 0,
            txt: "Start",
        }
        markers.unshift({
            txt: "Start",
            idx: 0,
        })
    }
    if (
        markers.length === 0 ||
        castInteger(markers[markers.length - 1].idx) !== trace.lat.length - 1
    ) {
        markers.push({
            txt: "Stop",
            idx: trace.lat.length - 1,
            chk: 1,
        })
    }
    trace.text = markers
    return trace
}

const RX_PARSE_LAT_OR_LNG = /[ ]*(-?[0-9]+)[^0-9]+([0-9]+)[^0-9]+([0-9.]+)/

/**
 * Lat/lng can have two formats: `44.11488333333333` or `44° 06' 53.58"`.
 * In both cases, we have to return this float: 44.11488333333333
 */
function parseLatOrLng(v: string) {
    const m = RX_PARSE_LAT_OR_LNG.exec(v)
    if (!m) return parseFloat(v)
    const [, m1, m2, m3] = m
    const prefix = castInteger(m1)
    const minutes = castInteger(m2)
    const seconds = parseFloat(m3)
    return prefix + (SECONDS_PER_MINUTE * minutes + seconds) / SECONDS_PER_HOUR
}

function findMarkerByIdx(trace: TraceFile, idx: number) {
    const markers = trace.text
    if (!Array.isArray(markers) || markers.length < 1) return null
    for (const mrk of markers) {
        if (mrk.idx === idx) return mrk
    }
    return null
}

/**
 * Return an array of full URLs of all the images used in this trace.
 *
 * WARNING! The trace must be ormalized.
 */
function listAllImages(trace: TraceFile) {
    const urls: string[] = []

    if (Array.isArray(trace.text)) {
        trace.text.forEach(function (mrk) {
            if (Array.isArray(mrk.img)) {
                mrk.img.forEach(function (img) {
                    const url = mrkImgSrc(trace, img) ?? ""
                    if (urls.indexOf(url) === -1) {
                        urls.push(url)
                    }
                })
            }
        })
    }

    if (Array.isArray(trace.poi)) {
        trace.poi.forEach(function (poi) {
            if (typeof poi.icon === "string") {
                const url = mrkImgSrc(trace, poi.icon) ?? ""
                if (urls.indexOf(url) === -1) {
                    urls.push(url)
                }
            }
        })
    }

    return urls
}

/**
 * Return the smallest bound that includes all the bounds given in argument.
 * Bounds or traces can be given as arguments.
 */
function boundsUnion(...boundsOrTraces: Array<IBounds | TraceFile>) {
    const bound = {
        s: 90,
        n: -90,
        w: 180,
        e: -180,
    }
    boundsOrTraces.forEach((item: IBounds | TraceFile) => {
        let b = isTraceFile(item) ? bounds(item) : item
        bound.s = Math.min(bound.s, b.s)
        bound.n = Math.max(bound.n, b.n)
        bound.w = Math.min(bound.w, b.w)
        bound.e = Math.max(bound.e, b.e)
    })

    return bound
}

/**
 * Find and return an array of indexes of points near `(lat, lng)`.
 *    "trace" - Must have `lat`, `lng` attributes.
 *    "lat" - Latitude.
 *    "lng" - Longitude
 *    "threshold"  - Keep  only points  that are  less than `threshold` meters away from `(lat, lng)`.
 */
function findNearestPoints(
    trace: TraceFile,
    lat: number,
    lng: number,
    threshold: number
) {
    if (!Array.isArray(trace.lat) || !Array.isArray(trace.lng)) return []
    // Make sur the trace is normalized.
    normalize(trace)

    const distances = castArray(trace.dis)
    const HIGHER_THRESHOLD = 4

    // Store `threshold * threshold`  to avoid  computing square roots
    // for distances.
    const th2 = threshold * threshold
    const points: number[] = []
    const x = trace.lng[0]
    const y = trace.lat[0]
    const HALF = 0.5
    const latInMeters = distance(x, y - HALF, x, y + HALF)
    const lngInMeters = distance(x - HALF, y, x + HALF, y)
    let k = 0
    let waitingIdx = -1
    let waitingDis = 0
    let waitingVal = 0

    // Finding the first near point.
    while (k < trace.lat.length) {
        const dx = (lng - trace.lng[k]) * lngInMeters
        const dy = (lat - trace.lat[k]) * latInMeters
        const d = dx * dx + dy * dy
        if (d < th2) {
            // We found a near point.
            waitingIdx = k
            waitingDis = distances[k]
            waitingVal = d
            k++
            break
        }
        k++
    }

    // Looking for next near points.
    while (k < trace.lat.length) {
        const dx = (lng - trace.lng[k]) * lngInMeters
        const dy = (lat - trace.lat[k]) * latInMeters
        const d = dx * dx + dy * dy
        if (d < th2) {
            const dis = distances[k]
            if (dis - waitingDis > threshold * HIGHER_THRESHOLD) {
                // Save the waiting point.
                points.push(waitingIdx)
                waitingIdx = k
                waitingDis = dis
                waitingVal = d
            } else if (d < waitingVal) {
                // Overwrite  the waiting  point because  this one  is
                // nearest.
                waitingIdx = k
                waitingDis = dis
                waitingVal = d
            }
        }
        k++
    }

    if (waitingIdx > -1) {
        points.push(waitingIdx)
    }

    return points
}

function computeDis(data: TraceFile, useAltitudes: boolean = false) {
    if (!Array.isArray(data.lat) || !Array.isArray(data.lng)) return data

    if (
        useAltitudes &&
        Array.isArray(data.alt) &&
        data.alt.length === data.lat.length
    ) {
        return computeDis_UsingAltitudes(data)
    }

    data.dis = [0]
    let lat1 = data.lat[0]
    let lng1 = data.lng[0]
    let dis = 0
    for (let k = 1; k < data.lat.length; k++) {
        const lat2 = data.lat[k]
        const lng2 = data.lng[k]
        dis += distance(lat1, lng1, lat2, lng2)
        data.dis.push(dis)
        lat1 = lat2
        lng1 = lng2
    }
    return data
}

function computeDis_UsingAltitudes(data: TraceFile) {
    const altitudes = castArray(data.alt)

    data.dis = [0]
    let lat1 = data.lat[0]
    let lng1 = data.lng[0]
    let alt1 = altitudes[0]
    let dis = 0
    for (let k = 1; k < data.lat.length; k++) {
        const lat2 = data.lat[k]
        const lng2 = data.lng[k]
        const alt2 = altitudes[k]
        dis += distance(lat1, lng1, alt1, lat2, lng2, alt2)
        data.dis.push(dis)
        lat1 = lat2
        lng1 = lng2
        alt1 = alt2
    }
    return data
}

/**
 * Change the values of `arr` to make a line between `fromIndex` and `toIndex`.
 */
function linearize(arr: number[], fromIndex: number, toIndex: number) {
    if (toIndex - fromIndex < 2) return

    const val0 = arr[fromIndex]
    const val1 = arr[toIndex]
    const delta = val1 - val0
    const len = toIndex - fromIndex
    const coeff = delta / len
    for (let idx = 1; idx < len; idx++) {
        arr[idx + fromIndex] = val0 + coeff * idx
    }
}

/**
 * Return `{asc: 1652, dsc: 347}`
 */
function fastAscDsc(
    altitudes: number[],
    idxBegin = 0,
    _idxEnd: number = -1
): { asc: number; dsc: number } {
    const idxEnd = _idxEnd < 0 ? altitudes.length : _idxEnd
    let lastAltitude = altitudes[idxBegin]
    let asc = 0
    let dsc = 0
    for (let idx = idxBegin + 1; idx < idxEnd; idx++) {
        const altitude = altitudes[idx]
        const delta = altitude - lastAltitude
        if (delta > 0) asc += delta
        if (delta < 0) dsc -= delta
        lastAltitude = altitude
    }

    return { asc, dsc }
}

/**
 *
 */
function computeCumulatedElevation(
    altitudes: number[],
    idxBegin = 0,
    _idxEnd = -1
): { asc: number[]; dsc: number[] } {
    if (!Array.isArray(altitudes))
        throw Error("Arg `altitudes` must be an array!")

    const idxEnd = _idxEnd < 0 ? altitudes.length : _idxEnd
    let lastAltitude = altitudes[idxBegin]
    let asc = 0
    let dsc = 0
    const ascArr = [0]
    const dscArr = [0]

    for (let idx = idxBegin + 1; idx < idxEnd; idx++) {
        const altitude = altitudes[idx]
        const delta = altitude - lastAltitude
        if (delta > 0) asc += delta
        if (delta < 0) dsc -= delta
        lastAltitude = altitude
        ascArr.push(asc)
        dscArr.push(dsc)
    }

    return { asc: ascArr, dsc: dscArr }
}

const DEFAULT_TOLERANCE = 35

/**
 * * "tolerance" - If the first and lat points are at a distance (in meters)
 * lower than `tolerance`, we consider the trace as a loop.
 *
 * Return `true` is the starting point and the ending point are very near.
 */
function isLoop(trace: TraceFile, tolerance: number = DEFAULT_TOLERANCE) {
    const lat = trace.lat
    const lng = trace.lng

    if (!Array.isArray(lat) || !Array.isArray(lng)) return false

    const lat1 = lat[0]
    const lng1 = lng[0]
    const n = lat.length - 1
    const lat2 = lat[n]
    const lng2 = lng[n]
    const dist = distance(lat1, lng1, lat2, lng2)

    return dist < tolerance
}

/**
 * Build `count` pieces of `{lat: [...], lng: [...]}` of equal length.
 */
function fairSplit(data: TraceFile, count: number, att = "dis"): TraceFile[] {
    ensureAllArraysOfsameLength(data, "lat", "lng", att)
    if (count < 2) {
        return [{ lat: data.lat.slice(), lng: data.lng.slice() }]
    }

    const parts: TraceFile[] = []
    const indexes = getFairSplitSteps((data as IUntyped)[att], count)
    let lastIndex = 0
    indexes.forEach(function (index) {
        const end = index + 1
        parts.push({
            lat: data.lat.slice(lastIndex, end),
            lng: data.lng.slice(lastIndex, end),
        })
        lastIndex = index
    })
    return parts
}

/**
 * * "arr" - Array of ascending numerial values.
 * * "count" - Number of parts.
 * Return an array of indexes being the upper bounds of each part.
 */
function getFairSplitSteps(arr: number[], count: number) {
    const size = arr.length
    const min = arr[0]
    const max = arr[size - 1]
    const delta = max - min
    const indexes: number[] = []
    const partValues: number[] = []
    if (delta < 0.00000001) return []
    for (let i = 1; i < count; i++) {
        partValues.push(Math.floor(min + (delta * i) / count))
    }

    let index = 0
    while (partValues.length > 0) {
        const value = castInteger(partValues.shift(), -1)
        while (index < size && value > arr[index]) {
            index++
        }
        if (index >= size) break
        indexes.push(index)
    }
    indexes.push(size)
    return indexes
}

/**
 *
 */
function ensureAllArraysOfsameLength(
    data: TraceFile,
    ...attribNames: string[]
) {
    if (!data) {
        throw Error(`data is null!`)
    }

    const d = data as IUntyped

    for (const attribName of attribNames) {
        if (!Array.isArray(d[attribName])) {
            throw Error(`Attribute "${attribName}" must be an array!`)
        }
    }
    const size = d[attribNames[0]].length
    for (const attribName of attribNames) {
        const currentSize = d[attribName].length
        if (currentSize !== size) {
            throw Error(`All arrays must have the same lenght!
But data.${attribNames[0]}.length = ${size},
and data.${attribName}.length = ${currentSize}!`)
        }
    }
}

/**
 * If `text` is a string, return an array with all its characters.
 */
function text2array(input: any): string[] {
    if (Array.isArray(input)) return input
    if (typeof input !== "string") return []
    const arr: string[] = []
    for (const letter of input) {
        arr.push(`${letter}`)
    }
    return arr
}

function round(v: number): number {
    const HALF = 0.5
    return Math.floor(HALF + v)
}

function average(...values: number[]): number {
    let sum = 0
    for (const value of values) sum += value
    return sum / values.length
}

/**
 * Quick comparison between two traces.
 * They are almost equal as soon as they have the same latitudes.
 */
function areAlmostEqual(
    t1: TraceFile | null | undefined,
    t2: TraceFile | null | undefined
) {
    if (t1 === t2) return true
    if (!t1 || !t2) return false

    const lat1 = t1.lat
    if (!Array.isArray(lat1)) return false

    const lat2 = t2.lat
    if (!Array.isArray(lat2)) return false

    if (lat1.length !== lat2.length) return false

    for (let index = 0; index < lat1.length; index++) {
        if (Math.abs(lat1[index] - lat2[index]) > 1e-6) return false
    }

    return true
}
