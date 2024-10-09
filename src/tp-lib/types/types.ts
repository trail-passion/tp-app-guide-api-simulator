import { IBounds, TraceFile } from "./trace-file"
export { default as MapSource } from "../map/source/source-map"

export type SubType<Origin extends Record<string, any>, Type> = Pick<
    Origin,
    {
        [key in keyof Origin]: Origin[key] extends Type ? key : never
    }[keyof Origin]
>

export interface MinimalTrace {
    lat: number[]
    lng: number[]
}

export interface ITraceSummary {
    id: number
    name: string
    grp: string
    owner: string
    asc: number
    dsc: number
    km: number
    mob: boolean
}

export type ITrace = TraceFile

export interface ITraceWithDis extends ITrace {
    dis: number[]
}

export interface ITraceWithAltDis extends ITrace {
    alt: number[]
    dis: number[]
}

export type ISearchCriteriaMode =
    | "all"
    | "private"
    | "official"
    | "public"
    | "last"
    | "rank"

export interface ISearchCriteria {
    id: number | number[]
    name: string | string[]
    group: string | string[]
    modes: ISearchCriteriaMode | ISearchCriteriaMode[]
    page: number
    limit: number
    km: [number, number]
    asc: [number, number]
    dsc: [number, number]
    bounds?: IBounds
}

export interface IAttribution {
    label: string
    url: string
}

export interface IMapSource {
    id: string
    // Most of the map sources are represented
    // by a SourceXYZ object in Open Layers.
    type: "xyz"
    enabled: boolean
    // Some map sources need a key.
    key?: string
    // IGN needs a User-Agent name.
    userAgent?: string
    // Web page with the terms and conditions for this map.
    conditions?: string
    // User friendly name.
    name: string
    // Ex.: [
    //   "https://a.tile.thunderforest.com/landscape/${z}/${x}/${y}.png?apikey=${k}",
    //   "https://b.tile.thunderforest.com/landscape/${z}/${x}/${y}.png?apikey=${k}",
    //   ...
    // ]
    // ${x}: column.
    // ${y}: row.
    // ${z}: zoom level.
    // ${k}: private key (for IGN, for instance).
    urls: string[]
    // If `true`, we are allowed to store the tiles for offline usage.
    offline: boolean
    maxZoom: number
    // Most of the map sources are free. But they ask us to display the
    // attribution URLs.
    attributions: {
        [key: string]: IAttribution
    }
}

export type IMapSources = IMapSource[]

export type IFunctionGetTile = (
    source: IMapSource,
    col: number,
    row: number,
    zoom: number
) => Promise<string>

export interface IUser {
    id: number
    login: string
    nickname: string
    password: string
    roles: string[]
    enabled: boolean
    data: any
}

export interface IGeoPoint {
    lat: number
    lng: number
}

export interface ISearchTraceResult {
    page: number
    limit: number
    count: number
    traces: ITraceSummary[]
}

export interface IProximumPosition {
    index: number
    alpha: number
    lat: number
    lng: number
}

export type Children =
    | React.ReactElement
    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
    | string
    | number
    | boolean
    | null
    | undefined
    | Iterable<Children>

export type MapFilter = "none" | "gray" | "sepia" | "dark" | "light" | "blur"

export interface GeoPoint {
    lat: number
    lng: number
}

export interface GeoPointWithAltitude extends GeoPoint {
    alt: number
}

export interface GeoPoints {
    lat: number[]
    lng: number[]
    alt?: number[]
}

export interface MapTileSource {
    id: string
    // Some map sources need a key.
    key?: string
    // For now, we have only the default type.
    type: "xyz"
    // IGN needs a User-Agent name.
    userAgent?: string
    // Web page with the terms and conditions for this map.
    conditions?: string
    // User friendly name.
    name: string
    // Ex.: [
    //   "https://a.tile.thunderforest.com/landscape/${z}/${x}/${y}.png?apikey=${k}",
    //   "https://b.tile.thunderforest.com/landscape/${z}/${x}/${y}.png?apikey=${k}",
    //   ...
    // ]
    // ${x}: column.
    // ${y}: row.
    // ${z}: zoom level.
    // ${k}: private key (for IGN, for instance).
    urls: string[]
    // If `true`, we are allowed to store the tiles for offline usage.
    offline: boolean
    maxZoom?: number
    // Most of the map sources are free. But they ask us to display the
    // attribution URLs.
    attributions: string | { [key: string]: IAttribution }
    // These tiles are only available in this bounds.
    bounds?: { n: number; s: number; e: number; w: number }
}
