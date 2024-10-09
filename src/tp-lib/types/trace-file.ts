import { MultilingualText } from "./trace-data"

export interface TraceFile {
    lat: number[]
    lng: number[]

    alt?: number[]
    acc?: number[]
    asc?: number
    children?: ISecondaryTrace[]
    com?: IIntlText
    date?: string
    dis?: number[]
    dsc?: number
    /** Claimed duration in seconds */
    dur?: number
    filter?: string
    grp?: string
    grp$?: IIntlText
    /** Hearth rates in beats per minute */
    hrt?: number[]
    icons?: string[]
    id?: number
    km?: number
    level?: number
    link?: string
    logo?: string
    loops?: number
    map?: string
    markers?: IMarker[]
    name?: string
    name$?: IIntlText
    nck?: string
    poi?: IPoiMarker[]
    public?: boolean
    profil?: boolean
    protected?: boolean
    switches?: []
    text?: IStepMarker[]
    thr?: number
    tim?: number[]
    tourism?: { [key: string]: ITourismInfo }
    type?: number
    usr?: number
    zip?: number
}

export interface ITourismInfo {
    lbl: IIntlText
    val: IIntlText
}

export interface IIntlText {
    [key: string]: string
}

export interface IMarker {
    lat?: number
    lng?: number
    idx?: number
    /** Checkpoint? */
    chk?: number
    pau?: number
    num?: IIntlText | string
    txt?: IIntlText | string
    grp?: string
    com?: IIntlText | string
    pic?: string
    vid?: string
    rad?: number
    aud?: IIntlText | string
    ico?: number[]
    stp?: string
    /** MarkerType */
    typ?: number
}

export interface IPoiMarker extends IMarker {
    lat: number
    lng: number
    icon?: string | number
}

export interface IStepMarker extends IMarker {
    idx: number
    img?: string | string[]
    asc?: number
    dsc?: number
}

export interface ISecondaryTrace {
    id: number
    name: string
    $name?: MultilingualText
    bounds: IBounds
    visible: boolean
    color: string
    score: number
}

export interface IBounds {
    n: number
    e: number
    w: number
    s: number
    altMin?: number
    altMax?: number
    disMin?: number
    disMax?: number
}
