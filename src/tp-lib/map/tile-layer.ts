import Leaf from "leaflet"
import { MapTileSource } from "tp-lib/types"

export default class tileLayer extends Leaf.TileLayer {
    private readonly source: MapTileSource

    constructor(source: MapTileSource = DEFAULT_TILE_SOURCE) {
        const [urlTemplate] = source.urls
        const options: ExtendedTileLayerOptions = {
            attribution: makeAttributionHTML(source.attributions),
            maxZoom: source.maxZoom,
            k: source.key ?? "",
        }
        super(urlTemplate, options)
        this.source = source
    }
}

const DEFAULT_TILE_SOURCE: MapTileSource = {
    attributions: {
        "": {
            label: "Open Street Map",
            url: "https://openstreetmap.org",
        },
    },
    id: "osm",
    type: "xyz",
    name: "Open Street Map",
    urls: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
    ],
    offline: true,
}

function makeAttributionHTML(
    attributions:
        | string
        | {
              [key: string]: { url: string; label: string }
          }
): string | undefined {
    if (typeof attributions === "string") return attributions

    return Object.keys(attributions)
        .map(
            (key) =>
                `${key} <a href="${attributions[key].url}">${attributions[key].label}</a>`
        )
        .join(", ")
}

interface ExtendedTileLayerOptions extends Leaf.TileLayerOptions {
    /** Personal Key to use with this tile source. */
    k: string
}
