import { ITourismInfo, TraceFile } from "tp-lib/types"
import { isObject } from "../tools/type-guards"
import { TranslateLib as Translate } from "tp-lib/translate"

/**
 * Return
 * {
 *   ...
 *   tourism: {
 *     duration: {
 *       lbl: { en: "Duration", fr: "Durée" }
 *       val: { en: "3 days", fr: "3 jours" }
 *     },
 *    ...
 *   }
 * }
 */
export default function normalizeTourism(data: TraceFile) {
    const tourism: { [key: string]: ITourismInfo } = {}
    if (isObject(data.tourism)) {
        const input: { [key: string]: any } = data.tourism as {
            [key: string]: any
        }
        for (const key of Object.keys(input)) {
            const value: { lbl: any; val: any } = input[key]
            if (!isObject(value)) continue

            const { lbl, val } = value
            if (!lbl || !val) continue

            tourism[key] = {
                lbl: Translate.$toIntl(lbl),
                val: Translate.$toIntl(val),
            }
        }
    }
    return tourism
}
