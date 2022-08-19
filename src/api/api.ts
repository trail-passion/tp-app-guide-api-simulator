import { ApiSetRating } from "./entry-points/set-rating"
import { isArray, isObject, isString } from "tp-lib/tools/type-guards"
import {
    ApiGetAppInfo,
    ApiGetAverageRating,
    ApiGetImage,
    ApiGetLocation,
    ApiGetPref,
    ApiSetPref,
    ApiGetStoreVersion,
    ApiGetTile,
    ApiSpeak,
} from "./entry-points"

const VERBOSE_MODE = true

type EntryPoint = (...params: any[]) => Promise<any>

const API: { [key: string]: EntryPoint } = {
    getAppInfo: ApiGetAppInfo,
    getAverageRating: ApiGetAverageRating,
    getImage: ApiGetImage,
    getLocation: ApiGetLocation,
    getPref: ApiGetPref,
    getStoreVersion: ApiGetStoreVersion,
    getTile: ApiGetTile,
    setPref: ApiSetPref,
    setRating: ApiSetRating,
    speak: ApiSpeak,
}

export default async function exec(input: string, post: (args: any) => void) {
    if (!isString(input)) return

    try {
        const data: any = JSON.parse(input)
        if (!isObject(data)) return

        const { type, id, method, params } = data
        if (type !== "TrailPassionCore") return
        if (!isString(method)) return
        if (!isArray(params)) return

        const entryPoint = API[method]
        if (!entryPoint) {
            console.error("This entry point is not implemented!", method)
            return
        }
        if (VERBOSE_MODE) {
            console.log(`<<< [${id}] "${method}":`, params)
        }
        const result = await entryPoint(...params)
        const message = { id, msg: result }
        if (VERBOSE_MODE) {
            console.log(">>>", message)
        }
        post(message)
    } catch (ex) {
        console.error("Unable to parse message:", input)
        console.error(ex)
    }
}
