import WebService from "tp-lib/service/service"
import { IMapSource } from "tp-lib/types"
import { isObject } from "tp-lib/tools/type-guards"
import { throwIfNeeded } from "./common"
import {
    assertArray,
    ensureArray,
    ensureMultilingualText,
    ensureNumber,
    ensureString,
} from "tp-lib/tools/type-guards"
import {
    IApplicationPackage, ITour, ITourTheme,
} from "../types"

const Tours = {
    async list(): Promise<ITour[]> {
        const args = { cmd: "lst-tour" }
        const result = await WebService.exec("tp.Tour", args)
        try {
            throwIfNeeded(result)
            assertArray(result, "tp-Tour/lst-tour")
            return result.map(normalize)
        } catch (ex) {
            console.error("Unable to get the list of tours:", args)
            console.error("   ", ex)
            throw Error("Unable to get the list of tours!")
        }
    },

    async getApplicationPackage(
        tourId: number,
        version: string
    ): Promise<IApplicationPackage> {
        const args = { cmd: "package", tourId, mode: version }
        const result = await WebService.exec("tp.Tour", args)
        try {
            throwIfNeeded(result)
            return result as IApplicationPackage
        } catch (ex) {
            console.error("Unable to get package:", args)
            console.error("   ", ex)
            throw Error("Unable to get package!")
        }
    },
}

export default Tours

const EMPTY_TOUR: ITour = {
    id: 0,
    logo: "",
    maps: [],
    name: "",
    packs: [],
    status: 0,
    theme: {
        bg0: "",
        bg1: "",
        bg2: "",
        bg3: "",
        bgP: "",
        bgPL: "",
        bgPD: "",
        bgS: "",
        bgSL: "",
        bgSD: "",
    },
    title: {},
    version: { prod: 0, test: 0 },
}

function normalize(tour: unknown): ITour {
    if (!isObject(tour)) return { ...EMPTY_TOUR }

    if (!Array.isArray(tour.packs)) tour.packs = []
    tour.title = ensureMultilingualText(tour.title, {en: "Bad title!"})
    const maps = ensureArray<IMapSource>(tour.maps)
    return {
        id: ensureNumber(tour.id, 0),
        logo: ensureString(tour.logo, ""),
        maps,
        name: ensureString(tour.name, ""),
        packs: ensureArray<number>(tour.packs),
        status: 0,
        theme: ensureTheme(tour.theme),
        title: ensureMultilingualText(tour.title),
        version: ensureTourVersion(tour.version),
    }
}

function ensureTheme(data: unknown): ITourTheme {
    if (!isObject(data)) return { ...EMPTY_TOUR.theme }

    return {
        bg0: ensureString(data.bg0, ""),
        bg1: ensureString(data.bg1, ""),
        bg2: ensureString(data.bg2, ""),
        bg3: ensureString(data.bg3, ""),
        bgP: ensureString(data.bgP, ""),
        bgPL: ensureString(data.bgPL, ""),
        bgPD: ensureString(data.bgPD, ""),
        bgS: ensureString(data.bgS, ""),
        bgSL: ensureString(data.bgSL, ""),
        bgSD: ensureString(data.bgSD, ""),
    }
}

function ensureTourVersion(data: unknown): { prod: number; test: number } {
    if (!isObject(data)) return { prod: 0, test: 0 }
    return {
        prod: ensureNumber(data.prod, 0),
        test: ensureNumber(data.test, 0),
    }
}
