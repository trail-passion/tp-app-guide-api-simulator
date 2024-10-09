import { ITrace, TraceData, TraceFile } from "tp-lib/types"
import { isNumber, isObject } from "../../tools/type-guards"
import { convertIconURLToDataURI } from "../../trace-manager/convert-icon-to-data-uri"
import { convertTraceFileToData } from "../../trace-manager/convert-to-data"
import { convertTraceDataToFile } from "../../trace-manager/convert-to-file"
import { assertTraceFile } from "../../trace-manager/validator"
import TraceTools from "../../trace-tools"
import Service from "../service"

export default {
    /**
     * @deprecated
     */
    async load(id: number): Promise<TraceFile> {
        const trace = await Service.exec("tp4.Load", id)
        if (isNumber(trace)) {
            if (trace === -1) throw Error(`Trace #${id} not found!`)
            console.error(`tp/service/trace/load(${id}) === ${trace}`)
            throw Error(`Unable to load trace #${id} due to an internal error!`)
        }
        if (!isObject(trace)) {
            console.error("Unable to load trace:", id)
            console.error("   Error:", trace)
            throw Error("Unable to load trace!")
        }
        return TraceTools.normalize(trace as unknown as ITrace)
    },

    /**
     * @deprecated
     */
    async save(trace: ITrace): Promise<{ id: number; tag?: unknown }> {
        const normalized = TraceTools.normalize(TraceTools.copy(trace))
        const zip = TraceTools.zip(normalized)
        const result = await Service.exec("tp4.Save", { data: zip })
        if (!isObject(result)) {
            console.error("Unable to save trace:", trace)
            console.error("   Error:", result)
            throw Error("Unable to save trace!")
        }
        const { id, tag } = result
        if (!isNumber(id)) {
            console.error("Unable to save trace:", trace)
            console.error("   Error:", result)
            throw Error("Unable to save trace!")
        }
        return { id, tag }
    },

    /**
     * Load a trace whose `id` is given.
     * Throws an exception if such trace does not exist.
     */
    async loadTraceData(id: number): Promise<TraceData> {
        const traceFile = await Service.exec("tp4.Load", id)
        if (typeof traceFile === "number") {
            if (traceFile === -1) throw Error(`Trace #${id} not found!`)
            console.error(
                `tp/service/trace/loadTraceData(${id}) === ${traceFile}`
            )
            throw Error(`Unable to load trace #${id} due to an internal error!`)
        }
        try {
            assertTraceFile(traceFile)
        } catch (ex) {
            console.error("Unable to load trace data:", id)
            console.error("   Trace:", traceFile)
            console.error("   Error:", ex)
            throw ex
        }
        castToNumberArray(traceFile.lat)
        castToNumberArray(traceFile.lng)
        if (traceFile.alt) castToNumberArray(traceFile.alt)
        if (traceFile.dis) castToNumberArray(traceFile.dis)
        if (traceFile.acc) castToNumberArray(traceFile.acc)
        if (traceFile.hrt) castToNumberArray(traceFile.hrt)
        if (traceFile.tim) castToNumberArray(traceFile.tim)
        return await embedIconsAsDataURI(convertTraceFileToData(traceFile))
    },

    /**
     * @returns Id of the saved trace.
     * Can be different from the original id if the trace does not belong
     * to the current user (the trace is cloned in this case).
     */
    async saveTraceData(traceData: TraceData): Promise<number> {
        const traceFile = convertTraceDataToFile(traceData)
        const result = await Service.exec("tp4.Save", { data: traceFile })
        if (isObject(result) && isNumber(result.id)) return result.id

        console.error("Unable to save trace:", traceData)
        console.error("   Error:", result)
        throw Error("Unable to save trace!")
    },
}

async function embedIconsAsDataURI(traceData: TraceData): Promise<TraceData> {
    const { markers } = traceData
    for (const mrk of markers) {
        const { icons } = mrk
        for (let i = 0; i < icons.length; i++) {
            icons[i] = await convertIconURLToDataURI(icons[i])
        }
    }
    return traceData
}

function castToNumberArray(arr: unknown[]): asserts arr is number[] {
    for (let i = 0; i < arr.length; i++) {
        const val = arr[i]
        if (typeof val === "number") continue
        if (typeof val === "string") {
            const num = parseFloat(val)
            arr[i] = num
        } else {
            arr[i] = Number.NaN
        }
    }
}
