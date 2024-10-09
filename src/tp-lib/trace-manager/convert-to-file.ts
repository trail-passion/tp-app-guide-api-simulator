import { IMarker, MarkerType } from "tp-lib/types"
import { TranslateLib as Translate } from "tp-lib/translate"
import { TraceData } from "../types/trace-data"
import { ISecondaryTrace, TraceFile } from "../types/trace-file"
import { zipTrace } from "./zip"

export function convertTraceDataToFile(data: TraceData): TraceFile {
    return zipTrace({
        id: data.id,
        ...convertArrays(data),
        ...convertClaims(data),
        ...convertText(data),
        ...convertActivityAndLevel(data),
        ...convertMarkers(data),
        ...convertMap(data),
        ...convertDate(data),
        ...convertChildren(data),
        com: data.description,
        profil: data.profil,
        public: !data.private,
        protected: data.protected,
        link: data.link,
        logo: data.logo,
        usr: data.authorId,
        thr: data.elevationThreshold,
        tourism: data.tourism,
    })
}

function convertChildren(
    data: TraceData
): { children: ISecondaryTrace[] } | undefined {
    if (!data.children) return undefined

    return {
        children: data.children.map((child) => {
            const fileChild: ISecondaryTrace = {
                id: child.id,
                name: Translate.$toText(child.name),
                $name: child.name,
                bounds: child.bounds,
                visible: child.visible,
                color: child.color,
                score: child.score,
            }
            return fileChild
        }),
    }
}

function convertMap(data: TraceData) {
    return { map: data.map ?? "ignExpress", filter: data.filter }
}

function convertDate(data: TraceData) {
    const d = data.date
    if (!d) return undefined

    return {
        date: `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(
            d.getDate()
        )}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`,
    }
}

function convertArrays(traceData: TraceData) {
    const { lat, lng, alt, acc, hrt, tim } = traceData
    return { lat, lng, alt, acc, hrt, tim }
}

function convertClaims(traceData: TraceData) {
    return {
        km: traceData.claimedDistanceKm,
        asc: traceData.claimedAscent,
        dsc: traceData.claimedDescent,
        dur: traceData.claimedDuration,
    }
}

function convertText(traceData: TraceData) {
    return {
        name: Translate.$toText(traceData.name),
        name$: traceData.name,
        grp: Translate.$toText(traceData.groupName),
        com: traceData.description,
        nck: traceData.authorName,
    }
}

function convertActivityAndLevel(traceData: TraceData) {
    return {
        level: traceData.level,
        type: traceData.activity,
    }
}

const NOT_FOUND = -1

function convertMarkers(traceData: TraceData) {
    const icons: string[] = []
    const markers: IMarker[] = []
    for (const mrk of traceData.markers) {
        const fileMarker: IMarker = {
            lat: mrk.lat,
            lng: mrk.lng,
            aud: mrk.audio,
            chk: mrk.type === MarkerType.checkpoint ? 1 : 0,
            com: mrk.description,
            ico: (mrk.icons ?? []).map((url) => {
                let iconIndex = icons.indexOf(url)
                if (iconIndex === NOT_FOUND) {
                    iconIndex = icons.length
                    icons.push(url)
                }
                return iconIndex
            }),
            idx: mrk.index,
            num: mrk.label,
            pau: mrk.pause,
            pic: mrk.picture,
            rad: mrk.radius,
            stp: mrk.stop,
            txt: mrk.name,
            grp: mrk.group,
        }
        markers.push(fileMarker)
    }
    return { icons, markers }
}

function pad(value: number, padding = 2) {
    let txt = `${value}`
    while (txt.length < padding) txt = `0${txt}`
    return txt
}
