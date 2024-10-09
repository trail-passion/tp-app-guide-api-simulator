import Service from '../service'
import { IEvent } from './types'

const EVENT_TYPE_DIST = 0
const EVENT_TYPE_TIME = 1
const EVENT_TYPE_LOOP = 2

export default {
    EVENT_TYPE_DIST,
    EVENT_TYPE_TIME,
    EVENT_TYPE_LOOP,
    list
    //get
}

async function list(): Promise<IEvent[]> {
    const result = await Service.exec(
        "tp.Event", { cmd: "all" }
    )
    if (!isServiceEventAll(result)) {
        console.error("The service tp.Event didn't return a valid ISeRviceEventAll!", result)
        return []
    }

    const events: IEvent[] = []
    for (let i = 0; i < result.id.length; i++) {
        events.push({
            id: result.id[i],
            name: result.name[i],
            desc: result.desc[i],
            type: result.type[i],
            date: new Date(result.time[i]),
            traces: []
        })
    }
    return events
}

// async function get(eventId: number): Promise<IEvent> {
//     const result = await Service.exec(
//         "tp.Event", { cmd: "get", id: eventId }
//     )
//     if (!isServiceEventAll(result)) {
//         console.error("The service tp.Event didn't return a valid ISeRviceEventAll!", result)
//         return []
//     }

//     const events: IEvent[] = []
//     for (let i = 0; i < result.id.length; i++) {
//         events.push({
//             id: result.id[i],
//             name: result.name[i],
//             desc: result.desc[i],
//             type: result.type[i],
//             date: new Date(result.time[i]),
//             traces: []
//         })
//     }
//     return events
// }

function isServiceEventAll(value: any): value is IServiceEventAll {
    if (typeof value !== 'object') return false
    const dic = value as { [key: string]: any }
    if (!Array.isArray(dic.id)) return false
    if (!Array.isArray(dic.name)) return false
    if (!Array.isArray(dic.desc)) return false
    if (!Array.isArray(dic.type)) return false
    if (!Array.isArray(dic.time)) return false
    const idLen = dic.id.length
    const idName = dic.name.length
    const idDesc = dic.desc.length
    const idType = dic.type.length
    const idTime = dic.time.length
    if (idLen !== idName) return false
    if (idLen !== idDesc) return false
    if (idLen !== idType) return false
    if (idLen !== idTime) return false
    return true
}


interface IServiceEventAll {
    id: number[]
    name: string[]
    desc: string[]
    type: number[]
    time: number[]
}
