export enum EnumEventType {
    EVENT_TYPE_DIST = 0,
    EVENT_TYPE_TIME = 1,
    EVENT_TYPE_LOOP = 2
}

export interface IEventTrace {
    id: number
    name: string
    km: number
    asc: number
    dsc: number
    min: number
    max: number
    start: number
}

export interface IEvent {
    id: number
    type: EnumEventType
    name: string
    desc: string
    date: Date
    code?: string
    traces: IEventTrace[]
}
