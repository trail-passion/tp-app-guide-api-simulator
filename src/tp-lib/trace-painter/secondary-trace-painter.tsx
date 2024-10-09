import * as React from "react"
import Button from "../ui/view/button"
import Flex from "../ui/view/flex"
import { MapManager } from "../map"
import Modal from "../ui/modal"
import Proximum from "../proximum"
import Touchable from "../ui/view/touchable"
import TraceService from "../service/trace"
import { TranslateLib as Translate } from "tp-lib/translate"
import { GeoPoint } from "tp-lib/types"
import { SecondaryTraceData, TraceData } from "tp-lib/types"
import "./secondary-trace-painter.css"

interface TraceWithProximum {
    trace: TraceData
    proximum: Proximum
}

interface TraceChildrenContext {
    markerId: number
    traces: TraceWithProximum[]
}

const globalContextMap = new Map<MapManager, TraceChildrenContext>()

export function paintTraceChildren(
    map: MapManager,
    traces: SecondaryTraceData[]
) {
    const context: TraceChildrenContext = globalContextMap.get(map) ?? {
        markerId: -1,
        traces: [],
    }
    globalContextMap.set(map, context)
    for (const secondaryTrace of traces) {
        if (secondaryTrace.visible) {
            TraceService.loadTraceData(secondaryTrace.id)
                .then((trace) => {
                    context.traces.push({
                        trace,
                        proximum: new Proximum(trace),
                    })
                    map.polyline.add({
                        lat: trace.lat,
                        lng: trace.lng,
                        backgrounds: ["#000"],
                        colors: [secondaryTrace.color],
                        shadow: 6,
                        thickness: 4,
                        dashArray: `2 10`,
                    })
                })
                .catch(console.error)
        }
    }
    map.eventTap.add((point: GeoPoint) => {
        map.marker.remove(context.markerId)
        const traceIds = new Set<number>()
        const children: TraceData[] = []
        console.log("🚀 [secondary-trace-painter] point = ", point) // @FIXME: Remove this line written on 2024-04-24 at 18:19
        context.traces.forEach(({ trace, proximum }) => {
            const hit = proximum.find(point.lat, point.lng)
            console.log(
                "🚀 [secondary-trace-painter] trace.id, hit = ",
                trace.id,
                hit
            ) // @FIXME: Remove this line written on 2024-04-24 at 18:19
            if (hit) {
                const { id } = trace
                console.log("🚀 [secondary-trace-painter] trace = ", trace) // @FIXME: Remove this line written on 2024-04-24 at 18:19
                if (typeof id === "undefined" || traceIds.has(id)) return

                traceIds.add(id)
                children.push(trace)
            }
        })
        if (children.length === 0) return

        const buttons = children.map((trace) => {
            return (
                <Touchable
                    className="tracePainter-SecondaryTracePainter theme-shadow-button"
                    backgroundColor={findColor(traces, trace.id)}
                    key={trace.id}
                    onClick={() =>
                        window.open(
                            `/trace/?id=${trace.id}`,
                            `trace/${trace.id}`
                        )
                    }
                >
                    <div className="name">{Translate.$toText(trace.name)}</div>
                    <div className="km">
                        {trace.claimedDistanceKm?.toFixed(1)} km
                    </div>
                    <div className="asc">{trace.claimedAscent} m↗</div>
                    <div className="dsc">{trace.claimedDescent} m↘</div>
                </Touchable>
            )
        })
        const modal = Modal.show({
            content: (
                <div
                    style={{
                        maxHeight: "95vh",
                        overflowY: "auto",
                        background: "var(--theme-color-neutral-5)",
                        color: "var(--theme-color-on-neutral-5)",
                    }}
                >
                    <div style={{ padding: "1em" }}>{buttons}</div>
                    <div
                        style={{
                            background: "var(--theme-color-neutral-3)",
                            color: "var(--theme-color-on-neutral-3)",
                        }}
                    >
                        <Flex justifyContent="space-around">
                            <Button
                                label={Translate.close}
                                onClick={() => modal.hide()}
                            />
                        </Flex>
                    </div>
                </div>
            ),
            autoClosable: true,
            align: "TL",
            backgroundColor: "transparent",
        })
    })
}

function findColor(
    traces: SecondaryTraceData[],
    id: number | undefined
): string | undefined {
    const trace = traces.find((t) => t.id === id)
    return trace?.color ?? "#000"
}
