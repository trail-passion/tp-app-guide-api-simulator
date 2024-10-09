import GenericEvent from "../tools/generic-event"
import Leaf from "leaflet"
import MarkerManager from "./marker-manager"
import OverlayManager from "./overlay-manager"
import PolylineManager from "./polyline-manager"
import PopupManager from "./popup-manager"
import Sources from "./source"
import TileLayer from "./tile-layer"
import ViewManager from "./view-manager"
import { GeoPoint, MapFilter, MapTileSource } from "tp-lib/types"
import { GeoBounds } from "tp-lib/types"

export interface MapOptions {
    enabled: boolean
}

export default class Map {
    public eventTap = new GenericEvent<GeoPoint>()
    public eventDoubleTap = new GenericEvent<GeoPoint>()
    /**
     * The mouse moves above the map.
     */
    public eventHover = new GenericEvent<GeoPoint>()
    public eventResize = new GenericEvent<Map>()
    public eventViewChange = new GenericEvent<Map>()
    public eventFilterChange = new GenericEvent<MapFilter | undefined>()
    public eventSourceChange = new GenericEvent<MapTileSource | undefined>()
    public readonly marker: MarkerManager
    public readonly overlay: OverlayManager
    public readonly polyline: PolylineManager
    public readonly popup: PopupManager
    public readonly view: ViewManager
    private readonly map: Leaf.Map
    private currentLayer: TileLayer = new TileLayer()
    private _filter?: MapFilter
    private _source: MapTileSource = Sources.get("osm") as MapTileSource

    constructor(
        public readonly element: HTMLElement,
        options: Partial<MapOptions> = {}
    ) {
        const opt: MapOptions = {
            enabled: true,
            ...options,
        }
        const map = new Leaf.Map(element, {
            attributionControl: true,
            zoomControl: false,
            dragging: opt.enabled,
            scrollWheelZoom: opt.enabled,
            doubleClickZoom: opt.enabled,
            zoom: 6,
            center: { lat: 46.2022, lng: 6.1457 },
        })
        this.currentLayer.addTo(map)
        this.marker = new MarkerManager(map)
        this.overlay = new OverlayManager(map)
        this.polyline = new PolylineManager(map)
        this.popup = new PopupManager(map)
        this.view = new ViewManager(map)
        this.map = map
        const [defaultSourceId] = Sources.all()
        this.source = Sources.get(defaultSourceId)
        map.on("click", (evt: Leaf.LeafletMouseEvent) => {
            this.eventTap.fire(evt.latlng)
        })
        map.on("dblclick", (evt: Leaf.LeafletMouseEvent) => {
            this.eventDoubleTap.fire(evt.latlng)
        })
        map.on("mousemove", (evt: Leaf.LeafletMouseEvent) => {
            this.eventHover.fire(evt.latlng)
        })
        map.on("resize", () => this.eventResize.fire(this))
        map.on("moveend", () => this.eventViewChange.fire(this))
        map.on("zoomend", () => this.eventViewChange.fire(this))
    }

    set filter(filter: MapFilter | undefined) {
        this._filter = filter
    }

    get filter() {
        return this._filter
    }

    get source() {
        return this._source
    }
    set source(source: MapTileSource) {
        const { map, currentLayer } = this
        if (currentLayer) map.removeLayer(currentLayer)
        const layer = new TileLayer(source)
        map.addLayer(layer)
        this.currentLayer = layer
        this._source = source
    }

    get sourceId() {
        return this.source.id
    }
    set sourceId(id: string) {
        this.source = Sources.get(id)
    }

    get bounds(): GeoBounds {
        const { map } = this
        const bounds = map.getBounds()
        return {
            n: bounds.getNorth(),
            s: bounds.getSouth(),
            w: bounds.getWest(),
            e: bounds.getEast(),
        }
    }

    /**
     * Force map redraw when you know that its size has changed.
     */
    refresh() {
        this.map.invalidateSize()
    }
}
