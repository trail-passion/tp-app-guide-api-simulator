export function castToFloat(data: unknown): number {
    switch (typeof data) {
        case "number":
            return data
        case "string":
            return parseFloat(data)
        default:
            return Number.NaN
    }
}

export function castToFloatOrUndef(data: unknown): number | undefined {
    switch (typeof data) {
        case "number":
            return data
        case "string":
            return parseFloat(data)
        default:
            return undefined
    }
}
