import Service from "../service"
import TraceTools from "../../trace-tools"

// Minimum number of second between two point to consider it's another race.
const FOLLOW_TIMEOUT = 86400

async function exec(params: any): Promise<any> {
    return await Service.exec("tp4.Follow", params)
}

export interface UserLocalization {
    tim: Date
    lat: number
    lng: number
    id: number
    name: string
    md5: string
    kind: number
}

export interface UserHistory {
    id: number
    name: string
    md5: string
    lat: number
    lng: number
    trace: {
        lat: number[]
        lng: number[]
        tim: number[]
    }
}

export default {
    async listLastFollowedTraceIds(limit: number = 10): Promise<number[]> {
        try {
            const data = await exec({ list: limit })
            if (Array.isArray(data)) {
                return data as number[]
            }
            console.error("Bad result:", data)
            return []
        } catch (ex) {
            console.error(
                "Unable to retrieve list of last followed traces!",
                ex
            )
            return []
        }
    },

    async getPositionsForUser(
        userId: number,
        maxRadiusInKm: number = 10
    ): Promise<UserHistory | null> {
        try {
            const data = await exec({ user: userId })
            if (!isUserPositionData(data)) {
                console.error("Bad format:", data)
                throw Error("Bad format!")
            }
            const { id, lat, lng, md5, name, arr } = data
            const trace = {
                lat: [lat],
                lng: [lng],
                tim: [0],
            }
            let tim0 = 0
            let lat0 = lat
            let lng0 = lng
            for (let i = 0; i < arr.length; i += 3) {
                const deltaTime = arr[i]
                if (deltaTime > FOLLOW_TIMEOUT) tim0 += deltaTime
                lat0 -= arr[i + 1] * 1e-6
                lng0 -= arr[i + 2] * 1e-6
                trace.tim.push(tim0)
                trace.lat.push(lat0)
                trace.lng.push(lng0)
                const dist = TraceTools.distance(lat, lng, lat0, lng0)
                if (dist > maxRadiusInKm * 1000) break
            }
            return {
                id,
                lat,
                lng,
                md5,
                name,
                trace,
            }
        } catch (ex) {
            console.error(
                `Unable to retrieve positions for user #${userId}!`,
                ex
            )
            return null
        }
    },

    async listPositionsForTrace(traceId: number): Promise<UserLocalization[]> {
        try {
            const data = await exec({ trace: traceId })
            if (!isTracePositionData(data)) {
                console.error("Received:", data)
                throw Error("Bad data format!")
            }
            return data.trace.map(item => {
                const [tim, lat, lng, name, id, md5, kind] = item
                return {
                    tim: new Date(tim),
                    lat,
                    lng,
                    name,
                    id,
                    md5,
                    kind,
                }
            })
        } catch (ex) {
            console.error(
                "Unable to retrieve list of last followed traces!",
                ex
            )
            return []
        }
    },
}
interface UserPositionData {
    id: number
    name: string
    md5: string
    lat: number
    lng: number
    arr: number[]
}

function isUserPositionData(data: any): data is UserPositionData {
    if (typeof data !== "object") return false
    const { id, name, md5, lat, lng, arr } = data
    if (typeof id !== "number") return false
    if (typeof name !== "string") return false
    if (typeof md5 !== "string") return false
    if (typeof lat !== "number") return false
    if (typeof lng !== "number") return false
    if (!Array.isArray(arr)) return false
    return true
}

interface TracePositionData {
    trace: TracePositionDataItem[]
}

type TracePositionDataItem = [
    string, // tim
    number, // lat
    number, // lng
    string, // name
    number, // id
    string, // md5
    number // kind
]

function isTracePositionData(data: any): data is TracePositionData {
    if (typeof data !== "object") return false
    const { trace } = data
    if (!Array.isArray(trace)) return false
    if (trace.length === 0) return true
    for (const [tim, lat, lng, name, id, md5, kind] of trace) {
        if (typeof tim !== "string") return false
        if (typeof lat !== "number") return false
        if (typeof lng !== "number") return false
        if (typeof name !== "string") return false
        if (typeof id !== "number") return false
        if (typeof md5 !== "string") return false
        if (typeof kind !== "number") return false
    }
    return true
}
