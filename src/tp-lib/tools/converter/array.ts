export default function castArray<T>(
    v: undefined | T | T[],
    defaultValue: T[] = []
): T[] {
    if (typeof v === "undefined") return defaultValue
    if (Array.isArray(v)) return v

    return [v]
}
