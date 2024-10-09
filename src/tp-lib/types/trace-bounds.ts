import { GeoBounds } from "./trace-data"

export interface TraceBounds extends GeoBounds {
    disMin: number
    disMax: number
    altMin: number
    altMax: number
}