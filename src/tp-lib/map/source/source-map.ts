import { MapTileSource } from "tp-lib/types"

const IGN_KEY =
    window.location.host === "localhost"
        ? /* DEV */ "6gon4npxpe2vi28x9e9beeux"
        : /* PRD */ "6gon4npxpe2vi28x9e9beeux"

const SOURCES: { [key: string]: MapTileSource } = {
    osm: {
        id: "osm",
        type: "xyz",
        name: "Open Street Map Classic",
        urls: [
            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
        ],
        maxZoom: 19,
        attributions: {
            "": {
                label: "Open Street Map",
                url: "https://openstreetmap.org/copyright",
            },
        },
        offline: true,
    },
    osmLandscape: {
        id: "osmLandscape",
        type: "xyz",
        name: "Open Street Map Landscape",
        key: "e55e9ae335a64895987bbe2be921a44f",
        urls: [
            "https://c.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={k}",
            "https://a.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={k}",
            "https://b.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={k}",
        ],
        maxZoom: 18,
        attributions: {
            "": {
                label: "Open Street Map Landscape",
                url: "https://openstreetmap.org/copyright",
            },
        },
        offline: true,
    },
    osmOutdoors: {
        id: "osmOutdoors",
        type: "xyz",
        name: "Open Street Map Outdoors",
        key: "e55e9ae335a64895987bbe2be921a44f",
        urls: [
            "https://a.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={k}",
            "https://b.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={k}",
            "https://c.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={k}",
        ],
        maxZoom: 18,
        attributions: {
            "": {
                label: "Open Street Map Landscape",
                url: "https://openstreetmap.org/copyright",
            },
        },
        offline: true,
    },
    osmCycles: {
        id: "osmCycles",
        type: "xyz",
        name: "Open Street Map Cycles",
        key: "e55e9ae335a64895987bbe2be921a44f",
        urls: [
            "https://a.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey={k}",
            "https://b.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey={k}",
            "https://c.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey={k}",
        ],
        maxZoom: 18,
        attributions: {
            "": {
                label: "Open Street Map Landscape",
                url: "https://openstreetmap.org/copyright",
            },
        },
        offline: true,
    },
    osmTopo: {
        id: "osmTopo",
        type: "xyz",
        name: "Open Topo Map",
        urls: ["https://opentopomap.org/{z}/{x}/{y}.png"],
        maxZoom: 19,
        attributions:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        offline: true,
    },
    ignMap: {
        id: "ignMap",
        type: "xyz",
        name: "IGN France",
        maxZoom: 18,
        attributions: {
            "": {
                label: "<img src='https://wxs.ign.fr/static/logos/IGN/IGN.gif'>",
                url: "https://www.geoportail.fr/",
            },
        },
        urls: [
            // "https://wxs.ign.fr/{k}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=normal&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg",
            "https://data.geopf.fr/private/wmts?LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&EXCEPTIONS=text/xml&FORMAT=image/jpeg&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&apikey=ign_scan_ws",
        ],
        key: IGN_KEY,
        offline: false,
    },
    ignExpress: {
        id: "ignExpress",
        type: "xyz",
        name: "IGN Scan25 France",
        maxZoom: 16,
        attributions: {
            "": {
                label: "<img src='https://wxs.ign.fr/static/logos/IGN/IGN.gif'>",
                url: "https://www.geoportail.fr/",
            },
        },
        urls: [
            // "https://wxs.ign.fr/{k}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=normal&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg",
            "https://data.geopf.fr/private/wmts?LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR&EXCEPTIONS=text/xml&FORMAT=image/jpeg&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&apikey=ign_scan_ws",
        ],
        key: IGN_KEY,
        offline: false,
    },
    ignPlan: {
        id: "ignPlan",
        type: "xyz",
        name: "IGN Plan France",
        maxZoom: 18,
        attributions: {
            "": {
                label: "<img src='https://wxs.ign.fr/static/logos/IGN/IGN.gif'>",
                url: "https://www.geoportail.fr/",
            },
        },
        urls: [
            // "https://wxs.ign.fr/{k}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=normal&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng",
            "https://data.geopf.fr/wmts?LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&EXCEPTIONS=text/xml&FORMAT=image/png&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
        ],
        key: "cartes",
        offline: false,
    },
    ignSat: {
        id: "ignSat",
        type: "xyz",
        name: "IGN Satellite France",
        maxZoom: 19,
        attributions: {
            "": {
                label: "<img src='https://wxs.ign.fr/static/logos/IGN/IGN.gif'>",
                url: "https://www.geoportail.fr/",
            },
        },
        urls: [
            // "https://wxs.ign.fr/{k}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=normal&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg",
            "https://data.geopf.fr/wmts?LAYER=ORTHOIMAGERY.ORTHOPHOTOS&EXCEPTIONS=text/xml&FORMAT=image/jpeg&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
        ],
        key: "ortho",
        offline: false,
    },
    ignCadastre: {
        id: "ignCadastre",
        type: "xyz",
        name: "IGN Cadastre",
        maxZoom: 20,
        attributions: {
            "": {
                label: "<img src='https://wxs.ign.fr/static/logos/IGN/IGN.gif'>",
                url: "https://www.geoportail.fr/",
            },
        },
        urls: [
            // "https://wxs.ign.fr/{k}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CADASTRALPARCELS.PARCELS&STYLE=bdparcellaire&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng",
            "https://data.geopf.fr/wmts?LAYER=CADASTRALPARCELS.PARCELS&EXCEPTIONS=text/xml&FORMAT=image/png&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
        ],
        key: "parcellaire",
        offline: false,
    },
    swisstopo: {
        id: "swisstopo",
        type: "xyz",
        name: "Swiss Topo",
        urls: [
            "https://wmts10.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg",
        ],
        maxZoom: 22,
        attributions:
            '© <a href="https://www.swisstopo.admin.ch/internet/swisstopo/en/home.html">Swiss Topo</a>',
        bounds: {
            s: 45.2,
            w: 5.1,
            n: 48.3,
            e: 11.6,
        },
        offline: true,
    },
    belgiumMap: {
        id: "belgiumMap",
        type: "xyz",
        name: "Cartographie IGN belge",
        urls: [
            "https://www.ngi.be/cartoweb/1.0.0/topo/default/3857/{z}/{y}/{x}.png",
        ],
        maxZoom: 19,
        attributions: "&copy; Cartographie IGN belge",
        bounds: {
            s: 49.2,
            w: 2.4,
            n: 51.5,
            e: 6.4,
        },
        offline: true,
    },
    // catalonia: {
    //     id: "catalonia",
    //     type: "xyz",
    //     name: "ICC Catalogne",
    //     urls: [
    //         "https://geoserveis.icc.cat/icc_mapesmultibase/noutm/wmts/topo/GRID3857/{z}/{x}/{y}.jpeg"
    //     ],
    //     maxZoom: 19,
    //     attributions:
    //         '© <a href="https://www.icgc.cat/">Institut Cartogràfic i Geològic de Catalunya</a>',
    //     bounds: {
    //         s: 40.3,
    //         w: 0.1,
    //         n: 42.8,
    //         e: 3.4
    //     },
    //     offline: true
    // },
    // norway: {
    //     id: "norway",
    //     type: "xyz",
    //     name: "Norway Kartverket",
    //     urls: [
    //         "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}"
    //     ],
    //     maxZoom: 19,
    //     attributions:
    //         '© <a href="https://kartverket.no/Kart/Gratis-kartdata/Cache-tjenester/">Kartverket</a>',
    //     bounds: {
    //         s: 57.2,
    //         w: 3.7,
    //         n: 72.2,
    //         e: 33.3
    //     },
    //     offline: true
    // },
    spain: {
        id: "spain",
        type: "xyz",
        name: "IGN Spaña",
        urls: [
            "https://www.ign.es/wmts/mapa-raster?layer=MTN&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}",
        ],
        maxZoom: 19,
        attributions:
            '© <a href="https://www.ign.es/ign/main/index.do/">IGN Spaña</a>',
        bounds: {
            s: 35.5,
            w: -10.2,
            n: 43.1,
            e: 5.4,
        },
        offline: true,
    },
    usgsImagery: {
        id: "usgsImagery",
        type: "xyz",
        name: "USGS Imagery",
        urls: [
            "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
        ],
        maxZoom: 8,
        attributions: "&copy; <a href='https://www.usgs.gov/'>USGS</a>",
        offline: true,
    },
    worldTopoMap: {
        id: "worldTopoMap",
        type: "xyz",
        name: "World Topo Map",
        urls: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        ],
        maxZoom: 19,
        attributions:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        offline: true,
    },
    // stamenWatercolor: {
    //     id: "stamenWatercolor",
    //     type: "xyz",
    //     name: "Watercolor Stamen Map",
    //     urls: ["https://d.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg"],
    //     maxZoom: 20,
    //     attributions:
    //         'Map tiles by <a href="https://stamen.com">Stamen Design</a>, under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="https://openstreetmap.org">OpenStreetMap</a>, under <a href="https://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
    //     offline: false
    // },
    // stamenTerrainBackground: {
    //     id: "stamenTerrainBackground",
    //     type: "xyz",
    //     name: "Terrain Background Stamen Map",
    //     urls: [
    //         "https://d.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg",
    //         "https://c.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg",
    //         "https://b.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg",
    //         "https://a.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg"
    //     ],
    //     maxZoom: 20,
    //     //bounds: { n: 45.60383, s: 41.329739000000004, e: -78.057876, w: -85.381153 },
    //     attributions:
    //         'Map tiles by <a href="https://stamen.com">Stamen Design</a>, under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="https://openstreetmap.org">OpenStreetMap</a>, under <a href="https://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
    //     offline: true
    // }
}

export default {
    get(id: string): MapTileSource {
        return SOURCES[id] ?? SOURCES["osm"]
    },

    has(id: string): boolean {
        return Boolean(SOURCES[id])
    },

    /**
     * @returns All the sources' ids.
     */
    all(): string[] {
        return Object.keys(SOURCES)
    },
}
