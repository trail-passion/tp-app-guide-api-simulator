import {
    assertGeoPoint,
    assertMapFilter,
    assertMapTileSource,
    GeoPoint,
    MapFilter,
    MapTileSource,
    TraceData,
} from "tp-lib/types"
import GenericEvent from "../../tools/generic-event"
import RemoteControlClient, { RemoteControlEvent } from "./client"

export default class TraceClient {
    private readonly client: RemoteControlClient
    public readonly eventReady = new GenericEvent<void>()
    public readonly eventMapDoubleTap = new GenericEvent<GeoPoint>()
    public readonly eventMapTap = new GenericEvent<GeoPoint>()
    public readonly eventMapFilterChange = new GenericEvent<MapFilter>()
    public readonly eventMapSourceChange = new GenericEvent<MapTileSource>()
    public readonly eventMarkerClick = new GenericEvent<GeoPoint>()
    public static IFRAME_ID = "TP/TracePreviewIFrame"
    private static _instance: TraceClient | null = null

    public static get instance() {
        if (!TraceClient._instance) {
            TraceClient._instance = new TraceClient()
        }
        return TraceClient._instance
    }

    private constructor() {
        this.client = new RemoteControlClient("TP/trace")
        this.client.addEventListener(this.handleEvent)
    }

    async setTrace(trace: TraceData) {
        await this.exec("reset", trace)
    }

    async centerMap(point: GeoPoint) {
        await this.exec("map-center", point)
    }

    private exec(name: string, params: unknown): Promise<unknown> {
        if (!this.client.iframe) {
            const iframe = document.getElementById(TraceClient.IFRAME_ID)
            if (!isIFrame(iframe)) {
                throw Error(
                    `An IFrame with id #${TraceClient.IFRAME_ID} must be defined in the DOM!`
                )
            }
            this.client.iframe = iframe
        }
        return this.client.exec(name, params)
    }

    private readonly handleEvent = ({ name, params }: RemoteControlEvent) => {
        try {
            switch (name) {
                case "ready":
                    this.eventReady.fire()
                    break
                case "double-tap":
                    assertGeoPoint(params)
                    this.eventMapDoubleTap.fire(params)
                    break
                case "tap":
                    assertGeoPoint(params)
                    this.eventMapTap.fire(params)
                    break
                case "filter-change":
                    assertMapFilter(params)
                    this.eventMapFilterChange.fire(params)
                    break
                case "source-change":
                    assertMapTileSource(params)
                    this.eventMapSourceChange.fire(params)
                    break
                case "marker-tap":
                    assertGeoPoint(params)
                    this.eventMarkerClick.fire(params)
                    break
            }
        } catch (ex) {
            console.error(`Error while handling event "${name}"!`)
            console.error("    > Params:", params)
            console.error("    > Error: ", ex)
        }
    }
}

function isIFrame(data: unknown): data is HTMLIFrameElement {
    if (!data) return false
    if (!(data instanceof Element)) return false
    return data.tagName === "IFRAME"
}
