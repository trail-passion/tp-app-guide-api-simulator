export type IBibGender = "M" | "F" | "X" | "TM" | "TF" | "TX"

export interface IBib {
    eventId: number
    traceId: number
    num: number
    firstname: string
    lastname: string
    year: number
    category: string
    gender: IBibGender
}
