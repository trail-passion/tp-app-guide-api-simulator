import { TranslateLib as Translate } from "tp-lib/translate"
import { computeDistances } from "./distance"
import { IMarker, TraceFile } from "../types/trace-file"
import {
    assertNumber,
    assertObject,
    assertOptionalMultilingualText,
    assertStringArray,
    isArray,
    isMultilingualText,
    isNumber,
    isObject,
    isString,
    isUndefined,
} from "../tools/type-guards"
import { unzipTrace } from "./zip"
import {
    MarkerData,
    MarkerType,
    MultilingualText,
    TraceData,
} from "../types/trace-data"
import { KM_PER_METER } from "../constants"
import Proximum from "../proximum"
import { computeDistance } from "../geo-tools"
import { MapFilter } from "tp-lib/types"

export function convertTraceFileToData(zippedTraceFile: TraceFile): TraceData {
    const file: TraceFile = unzipTrace(zippedTraceFile)
    const traceData: TraceData = {
        ...convertLatAndLng(file),
        ...convertDisAltAccTimHrt(file),
        ...convertActivityAndLevel(file),
        ...convertChildren(file),
        id: file.id,
        description: Translate.$toIntl(file.com),
        private: !(file.public ?? true),
        profil: file.profil ?? true,
        protected: file.protected ?? false,
        name: toMandatoryMultiLang("My trace", file.name$, file.name),
        groupName: file.grp,
        logo: getLogo(file),
        markers: convertMarkers(file),
        map: file.map ?? "ignExpress",
        filter: (file.filter ?? "none") as MapFilter,
        elevationThreshold: file.thr ?? 0,
        tourism: file.tourism ?? {},
        claimedAscent: file.asc ?? computeTotalAscent(file),
        claimedDescent: file.dsc ?? computeTotalDescent(file),
        claimedDistanceKm: file.km ?? computeTotalDistanceKm(file),
        claimedDuration: file.km ?? computeTotalDuration(file),
    }
    snapMarkersToTrace(traceData)
    return traceData
}

function convertChildren(file: TraceFile) {
    if (!file.children || file.children.length === 0) return undefined

    return {
        children: file.children.map((child) => ({
            id: child.id,
            name: toMandatoryMultiLang(
                `Sub trace #${child.id}`,
                child.$name,
                child.name
            ),
            bounds: child.bounds,
            color: child.color,
            visible: child.visible,
            score: child.score,
        })),
    }
}

function convertLatAndLng({ lat, lng }: TraceFile) {
    return { lat, lng }
}

function convertDisAltAccTimHrt(traceFile: TraceFile) {
    const pointsCount = traceFile.lat.length
    const { alt, acc, tim, hrt } = traceFile
    return {
        dis: computeDistancesIfMissing(traceFile),
        alt: getIfExpectedLength(alt, pointsCount),
        acc: getIfExpectedLength(acc, pointsCount),
        tim: getIfExpectedLength(tim, pointsCount),
        hrt: getIfExpectedLength(hrt, pointsCount),
    }
}

function computeDistancesIfMissing(traceFile: TraceFile): number[] {
    if (traceFile.dis && traceFile.dis.length === traceFile.lat.length)
        return traceFile.dis
    const realDistances = computeDistances(traceFile)
    if (typeof traceFile.km !== "number" || traceFile.km < 1)
        return realDistances
    const scale =
        (1000 * traceFile.km) / realDistances[realDistances.length - 1]
    // We stick to the claimed distance, not to the real one.
    return realDistances.map((d) => d * scale)
}

function convertActivityAndLevel({ level, type }: TraceFile) {
    return {
        level: level ?? 0,
        activity: type ?? 0,
    }
}

/**
 * @returns `arr` only is defined and of `expectedLength` length, otherwise return an empty array
 */
function getIfExpectedLength(
    arr: number[] | undefined,
    expectedLength: number
): number[] {
    if (!Array.isArray(arr) || arr.length !== expectedLength) return []
    return [...arr]
}

function toMandatoryMultiLang(
    defaultText: string,
    ...candidates: Array<undefined | string | MultilingualText>
): MultilingualText {
    for (const candidate of candidates) {
        if (typeof candidate === "undefined") continue
        if (typeof candidate === "string") return Translate.$toIntl(candidate)
        return candidate
    }
    return Translate.$toIntl(defaultText)
}

function toMultiLang(...candidates: unknown[]): MultilingualText | undefined {
    for (const candidate of candidates) {
        if (!candidate) continue
        if (isObject(candidate)) return candidate as MultilingualText
        if (typeof candidate === "string") return Translate.$toIntl(candidate)
        return Translate.$toIntl(JSON.stringify(candidate))
    }
}

function getLogo(traceFile: TraceFile): string {
    if (isString(traceFile.logo)) return traceFile.logo
    return `/tfw/preview.php?jpg=${traceFile.id ?? 0}&fb`
}

function convertMarkers(traceFile: TraceFile): MarkerData[] {
    const markers: unknown[] = traceFile.markers ?? []
    if (Array.isArray(traceFile.text) && traceFile.text.length > 0) {
        // On élimine les nouveau markers, parce que les anciens
        // ont la priorité.
        markers.splice(0, markers.length)
    }
    const traceIcons: string[] = traceFile.icons ?? []
    const newMarkers: MarkerData[] = markers
        .map((mrk: unknown, index: number) => {
            try {
                assertObject(mrk)
                const { lat, lng } = mrk
                const prefix = "marker"
                assertNumber(lat, `${prefix}.lat`)
                assertNumber(lng, `${prefix}.lng`)
                if (isIMarker(mrk)) {
                    console.log(mrk)
                    return {
                        id: index + 1,
                        lat: mrk.lat,
                        lng: mrk.lng,
                        index: mrk.idx ?? mrk.index,
                        type: convertMarkerType(mrk),
                        pause: mrk.pau,
                        label: toMultiLang(mrk.num),
                        name: toMultiLang(mrk.txt),
                        group: mrk.grp,
                        description: toMultiLang(mrk.com),
                        picture: mrk.pic,
                        radius: mrk.rad ?? 0,
                        audio: toMultiLang(mrk.aud),
                        // We don't want icons indirection here. We don't need to spare space,
                        // but we need fast access.
                        icons: ((mrk.ico ?? []) as number[])
                            .map((index: number) => traceIcons[index])
                            .filter(isString),
                        stop: mrk.stp,
                    }
                }
                const { id, radius, type, audio, description, name, icons } =
                    mrk
                assertNumber(id, `${prefix}.id`)
                assertNumber(radius, `${prefix}.radius`)
                assertNumber(type, `${prefix}.type`)
                assertOptionalMultilingualText(audio, `${prefix}.audio`)
                assertOptionalMultilingualText(
                    description,
                    `${prefix}.description`
                )
                assertOptionalMultilingualText(name, `${prefix}.name`)
                assertStringArray(icons, `${prefix}.icons`)
                const marker: MarkerData = {
                    id,
                    lat,
                    lng,
                    radius,
                    type,
                    audio,
                    description,
                    name,
                    icons: icons,
                }
                return marker
            } catch (ex) {
                console.error(ex)
                return null
            }
        })
        .filter((mrk) => mrk) as MarkerData[]
    appendOldPoiMarkers(newMarkers, traceFile)
    appendOldTextMarkers(newMarkers, traceFile)
    return newMarkers
}

function appendOldPoiMarkers(markers: MarkerData[], traceFile: TraceFile) {
    const oldMarkers = traceFile.poi
    if (!isArray(oldMarkers)) return

    let id = 1 + markers.reduce((val, mrk) => Math.max(val, mrk.id), 0)
    for (const mrk of oldMarkers) {
        markers.push({
            id: id++,
            lat: mrk.lat,
            lng: mrk.lng,
            type: mrk.stp ? MarkerType.primary : MarkerType.secondary,
            name: Translate.$toIntl(mrk.txt),
            group: mrk.grp,
            audio: Translate.$toIntl(mrk.aud),
            description: Translate.$toIntl(mrk.com),
            radius: mrk.rad ?? 10,
            picture: mrk.pic,
            icons: ensureArray(mrk.icon).map((n) => {
                if (typeof n === "string")
                    return `https://trail-passion.net/css/gfx/ravitos/${
                        n.length === 1 ? `mrk-${n}` : n
                    }.png`
                return `https://trail-passion.net/tfw/pub/icons/${traceFile.usr}/${n}.png`
            }),
        })
    }
}

function appendOldTextMarkers(markers: MarkerData[], traceFile: TraceFile) {
    const oldMarkers = traceFile.text
    if (!isArray(oldMarkers)) return

    let id = 1 + markers.reduce((val, mrk) => Math.max(val, mrk.id), 0)
    for (const mrk of oldMarkers) {
        const lat = traceFile.lat[mrk.idx]
        const lng = traceFile.lng[mrk.idx]
        markers.push({
            id: id++,
            lat,
            lng,
            index: mrk.idx,
            type: mrk.stp ? MarkerType.primary : MarkerType.secondary,
            name: Translate.$toIntl(mrk.txt),
            group: mrk.grp,
            stop: mrk.stp,
            audio: Translate.$toIntl(mrk.aud),
            description: Translate.$toIntl(mrk.com),
            radius: mrk.rad ?? 10,
            picture: mrk.pic,
            icons: converIcons(mrk.img, traceFile),
        })
    }
}

function convertMarkerType(mrk: IMarker): MarkerType {
    if (isNumber(mrk.typ)) return mrk.typ
    if (!isUndefined(mrk.chk)) return MarkerType.checkpoint
    if (isUndefined(mrk.com) && isUndefined(mrk.pic) && !isUndefined(mrk.aud))
        return MarkerType.audio
    return MarkerType.secondary
}

function ensureStringArray(img: string | string[] | undefined) {
    if (!img) return []
    if (typeof img === "string") return [img]
    return img
}

function ensureArray(img: string | string[] | number | number[] | undefined) {
    if (!img) return []
    if (typeof img === "string" || typeof img === "number") return [img]
    return img
}

function converIcons(
    img: string | string[] | undefined,
    traceFile: TraceFile
): string[] {
    const iconItems = ensureArray(img)
    const icons: string[] = []
    for (const item of iconItems) {
        if (isNumber(item)) {
            icons.push(`/tfw/pub/icons/${traceFile.usr}/${item}.png`)
        } else if (item.length === 1) {
            icons.push(`/css/gfx/ravitos/mrk-${item}.png`)
        } else {
            icons.push(`/css/gfx/ravitos/${item}.png`)
        }
    }
    return icons
}

/**
 * @returns Trace's duration in seconds.
 */
function computeTotalDuration({ tim = [] }: { tim?: number[] }): number {
    return tim.length < 2 ? 0 : tim[tim.length - 1] - tim[0]
}

function computeTotalDistanceKm({
    dis = [],
    lat = [],
    lng = [],
}: {
    dis?: number[]
    lat?: number[]
    lng?: number[]
}): number {
    if (dis.length < lat.length) {
        // Try to use `dis` to compute total distance.
        // `dis` elements are expressed in meters.
        dis = computeDistances({ lat, lng })
    }
    return dis.length < 2 ? 0 : (dis[dis.length - 1] - dis[0]) * KM_PER_METER
}

function computeTotalAscent({
    alt = [],
    thr = 10,
}: {
    alt?: number[]
    thr?: number
}): number {
    if (alt.length < 2) return 0

    let totalAscent = 0
    let accu = 0
    let previous = alt[0]
    for (let i = 1; i < alt.length; i++) {
        const current = alt[i]
        const ascent = current - previous
        previous = current
        accu += ascent
        if (ascent > thr) {
            totalAscent += accu
            accu = 0
        } else if (ascent < -thr) accu = 0
    }
    return totalAscent
}

function computeTotalDescent({
    alt = [],
    thr = 10,
}: {
    alt?: number[]
    thr?: number
}): number {
    if (alt.length < 2) return 0

    let totalDescent = 0
    let accu = 0
    let previous = alt[0]
    for (let i = 1; i < alt.length; i++) {
        const current = alt[i]
        const descent = previous - current
        previous = current
        accu += descent
        if (descent > thr) {
            totalDescent += accu
            accu = 0
        } else if (descent < -thr) accu = 0
    }
    return totalDescent
}

function isIMarker(data: unknown): data is IMarker {
    if (!isObject(data)) return false
    const { aud, chk, com, ico, idx, rad, txt } = data
    if (aud && !isMultilingualText(aud)) return false
    if (com && !isMultilingualText(com)) return false
    if (txt && !isMultilingualText(txt)) return false
    if (chk && !isNumber(chk)) return false
    if (idx && !isNumber(idx)) return false
    if (rad && !isNumber(rad)) return false
    if (ico && !isArray(ico)) return false
    return true
}

function snapMarkersToTrace(traceData: TraceData) {
    const proximum = new Proximum(traceData)
    for (const mrk of traceData.markers) {
        if (isNumber(mrk.index)) continue

        const pos = proximum.find(mrk.lat, mrk.lng)
        if (!pos) delete mrk.index
        else {
            const dist = computeDistance(
                mrk.lat,
                mrk.lng,
                traceData.lat[pos.index],
                traceData.lng[pos.index]
            )
            if (dist < 25) {
                // Less than 25 meters: we snap it.
                mrk.index = pos.index
            } else {
                delete mrk.index
            }
        }
    }
}
