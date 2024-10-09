export default function castString(value: any, defaultValue: string = ""): string {
    if (typeof value === "number" && !isNaN(value)) {
        return `${value}`
    }
    if (typeof value === "string") return value

    return defaultValue
}
