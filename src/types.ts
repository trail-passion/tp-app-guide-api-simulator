import { IIntlText, IMapSource } from "tp-lib/types"

export interface IPackagePack {
    id: number
    title: IIntlText
    shortDescription: IIntlText
    longDescription: IIntlText
    background: string
    traces: number[]
    parent?: number
}

export interface IPackageMarker {
    lat: number
    lng: number
    idx?: number
    num?: IIntlText
    txt?: IIntlText
    com?: IIntlText
    pic?: string
    rad?: number
    aud?: IIntlText
    ico?: number[]
}

export interface IPackageTrace {
    id: number
    zip: number
    title: IIntlText
    com: IIntlText
    logo: string
    icons: string[]
    markers: IPackageMarker[]
    lat: number[]
    lng: number[]
    alt: number[]
    km: number
    asc: number
    dsc: number
    tourism: {
        [key: string]: {
            lbl: IIntlText
            val: IIntlText
        }
    }
    type?: number
}

export interface IApplicationPackage {
    title: IIntlText
    logo: string
    maps: IMapSource[]
    theme: {
        bg0: string
        bg1: string
        bg2: string
        bg3: string
        bgP: string
        bgPL: string
        bgPD: string
        bgS: string
        bgSL: string
        bgSD: string
    }
    packs: IPackagePack[]
    traces: IPackageTrace[]
    version?: string
    mode?: string
}

export interface IGeoLocation {
    status: string  // "off" | "denied" | "unavailable" | "on"
    lat: number
    lng: number
    alt: number
    speed: number
    accuracy: number
    altitudeAccuracy: number
    timestamp: number
}

export interface ITourTheme {
    bg0: string
    bg1: string
    bg2: string
    bg3: string
    bgP: string
    bgPL: string
    bgPD: string
    bgS: string
    bgSL: string
    bgSD: string
}

export interface IBaseTour {
    name: string
    theme: ITourTheme
}

export interface ITour extends IBaseTour {
    id: number
    maps: IMapSource[]
    logo: string
    title: IIntlText
    status: number
    packs: number[]
    version: {
        test: number
        prod: number
    }
}

