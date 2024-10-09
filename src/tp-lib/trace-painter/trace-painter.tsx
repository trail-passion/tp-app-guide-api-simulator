import * as React from "react"

import { MarkerData, MarkerType, TraceData } from "tp-lib/types"
import { MapManager, MarkerEvent } from "../map"
import { commputeTraceElevationCumuls } from "../trace-manager"
import { TranslateLib as Translate } from "tp-lib/translate"
import Modal from "../ui/modal"
import Button from "../ui/view/button"
import Dialog from "../ui/view/dialog"
import MoreIcon from "../ui/view/icons/more"
import Image from "../ui/view/image"
import RichText from "../view/rich-text"
import { paintTraceChildren } from "./secondary-trace-painter"

import MarkerPng from "./marker.png"

import "./trace-painter.css"

export default {
    paintTrace(trace: TraceData, map: MapManager) {
        map.polyline.clear()
        map.polyline.add(trace)
        if (Array.isArray(trace.children)) {
            paintTraceChildren(map, trace.children)
        }
        map.marker.clear()
        const ascDsc = commputeTraceElevationCumuls(trace)
        const markers = new Map<number, MarkerData>()
        for (const mrk of trace.markers) {
            if (!Array.isArray(mrk.icons) || mrk.icons.length === 0) continue

            if (mrk.type === MarkerType.invisible) continue

            const [url] = mrk.icons
            if (typeof mrk.lat !== "number" || typeof mrk.lng !== "number") {
                console.error("Bad marker!", mrk)
                continue
            }
            const id = map.marker.add({
                lat: mrk.lat,
                lng: mrk.lng,
                icon: url
                    ? {
                          url: ensureAbsolutePath(url),
                          anchor: [16, 32],
                          size: [32, 32],
                      }
                    : {
                          url: MarkerPng,
                          anchor: [7, 7],
                          size: [15, 15],
                      },
                clickable: true,
                label: Translate.$toText(mrk.label),
                labelClassName: "tpLib-TracePainter-markerLabel",
            })
            markers.set(id, mrk)
        }
        map.marker.eventTap.add((evt: MarkerEvent): void => {
            const mrk = markers.get(evt.id)
            if (!mrk) return

            const com = Translate.$toText(mrk.description)
            map.popup.show(
                evt,
                <div className="tpLib-TracePainter-popup">
                    <div className="title">
                        <div>{Translate.$toText(mrk.name)}</div>
                        {renderIcons(mrk)}
                    </div>
                    {renderLocation(mrk)}
                    {renderStats(trace, mrk, ascDsc)}
                    {renderTimeBarrier(mrk)}
                    {mrk.picture && (
                        <a className="pic" href={mrk.picture} target="PICTURE">
                            <Image src={mrk.picture} />
                        </a>
                    )}
                    <a
                        href={`https://maps.google.com/?daddr=${mrk.lat},${mrk.lng}`}
                        target="_blank"
                        className="directions"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>directions</title>
                            <path d="M14,14.5V12H10V15H8V11A1,1 0 0,1 9,10H14V7.5L17.5,11M21.71,11.29L12.71,2.29H12.7C12.31,1.9 11.68,1.9 11.29,2.29L2.29,11.29C1.9,11.68 1.9,12.32 2.29,12.71L11.29,21.71C11.68,22.09 12.31,22.1 12.71,21.71L21.71,12.71C22.1,12.32 22.1,11.68 21.71,11.29Z" />
                        </svg>
                    </a>
                    {com && (
                        <Button
                            color="primary-5"
                            icon={MoreIcon}
                            wide={true}
                            label={Translate.seeMore}
                            onClick={() => {
                                const modal = new Modal({
                                    align: "TR",
                                    content: (
                                        <Dialog
                                            title={Translate.$toText(mrk.name)}
                                            hideCancel={true}
                                            flat={true}
                                            labelOK={Translate.close}
                                            onOK={() => modal.hide()}
                                        >
                                            <div className="tpLib-TracePainter-popup">
                                                <div className="title">
                                                    {renderStats(
                                                        trace,
                                                        mrk,
                                                        ascDsc
                                                    )}
                                                    {renderIcons(mrk)}
                                                </div>
                                                {renderLocation(mrk)}
                                                {renderTimeBarrier(mrk)}
                                                {mrk.picture && (
                                                    <a
                                                        className="pic"
                                                        href={mrk.picture}
                                                        target="PICTURE"
                                                    >
                                                        <Image
                                                            src={mrk.picture}
                                                        />
                                                    </a>
                                                )}
                                                <RichText
                                                    lang={Translate.$lang}
                                                    content={com}
                                                />
                                            </div>
                                        </Dialog>
                                    ),
                                })
                                modal.show()
                            }}
                        />
                    )}
                </div>
            )
        })
    },
}

function renderStats(
    trace: TraceData,
    mrk: MarkerData,
    ascDsc: { asc: number[]; dsc: number[] }
) {
    const { index } = mrk
    if (typeof index !== "number") return null

    const durationInSeconds =
        Array.isArray(trace.tim) &&
        trace.tim.length > 1 &&
        index < trace.tim.length
            ? trace.tim[index] - trace.tim[0]
            : 0
    return (
        <div className="stats">
            <div>
                {trace.dis && `${(trace.dis[index] * 0.001).toFixed(1)} km`}
            </div>
            <div>
                {index > 0 &&
                    ascDsc.asc[index] &&
                    `${ascDsc.asc[index].toFixed(0)} ↗`}
            </div>
            <div>
                {index > 0 &&
                    ascDsc.dsc[index] &&
                    `${ascDsc.dsc[index].toFixed(0)} ↘`}
            </div>
            <div>
                {Array.isArray(trace.alt) &&
                    `(${Math.floor(trace.alt[index])} m)`}
            </div>
            <div>
                {Array.isArray(trace.tim) &&
                    trace.tim.length > 1 &&
                    `${formatTime(trace.tim[index] - trace.tim[0])} ⌚`}
            </div>
            <DeltaMarker trace={trace} mrk={mrk} ascDsc={ascDsc} />
        </div>
    )
}

function DeltaMarker({
    trace,
    mrk,
    ascDsc,
}: {
    trace: TraceData
    mrk: MarkerData
    ascDsc: { asc: number[]; dsc: number[] }
}) {
    const previousMarker = findPreviousMarker(trace, mrk)
    if (!previousMarker) return null

    const idx1 = mrk.index ?? 0
    const idx0 = previousMarker.index ?? 0
    const dis = (trace.dis[idx1] - trace.dis[idx0]) * 1e-3
    const asc = ascDsc.asc[idx1] - ascDsc.asc[idx0]
    const dsc = ascDsc.dsc[idx1] - ascDsc.dsc[idx0]
    return (
        <>
            <div className="from">
                {Translate.from} <b>{Translate.$toText(previousMarker.name)}</b>
            </div>
            <div>{dis.toFixed(1)} km</div>
            <div>{asc.toFixed(0)} ↗</div>
            <div>{dsc.toFixed(0)} ↘</div>
        </>
    )
}

function findPreviousMarker(
    trace: TraceData,
    mrk: MarkerData
): MarkerData | null {
    console.log("🚀 [trace-painter] mrk = ", mrk) // @FIXME: Remove this line written on 2024-04-17 at 10:37
    if (typeof mrk.index !== "number") return null

    let bestMarker: MarkerData | null = null
    for (const candidate of trace.markers) {
        if (typeof candidate.index !== "number") continue

        if (candidate.index >= mrk.index) continue

        if (!sameType(mrk, candidate)) continue

        if (!bestMarker || (bestMarker.index ?? 0) < candidate.index) {
            bestMarker = candidate
        }
    }
    return bestMarker
}

function sameType(mrk1: MarkerData, mrk2: MarkerData): boolean {
    return mrk1.type === mrk2.type
}

function renderIcons(mrk: MarkerData) {
    return (
        <div className="icons">
            {mrk.icons.map((url, index) => (
                <Image key={index} height={32} src={url} />
            ))}
        </div>
    )
}

function renderLocation(mrk: MarkerData) {
    if (typeof mrk.lat === "number" && typeof mrk.lat === "number") {
        return (
            <div className="location">
                {mrk.lat.toFixed(7)}, {mrk.lng.toFixed(7)}
            </div>
        )
    }
    return null
}

function renderTimeBarrier(mrk: MarkerData) {
    if (!mrk.stop) return null

    return (
        <div className="time">
            <div>
                {Translate.timeBarrier}
                <span className="stop">{mrk.stop}</span>
            </div>
        </div>
    )
}

function formatTime(time: number): string {
    const ss = time % 60
    time = Math.floor(time / 60)
    const mm = time % 60
    time = Math.floor(time / 60)
    const hh = time
    return `${hh}:${pad(mm)}'${pad(ss)}''`
}

function pad(value: number): string {
    let txt = `${value}`
    while (txt.length < 2) txt = `0${txt}`
    return txt
}

/**
 * Ensure compatibility with old markers.
 */
function ensureAbsolutePath(url?: string): string | undefined {
    if (!url) return
    if (url.startsWith("css/")) return `https://trail-passion.net/${url}`
    return url
}
