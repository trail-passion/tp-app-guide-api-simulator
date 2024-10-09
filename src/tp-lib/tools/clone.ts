import { isObject } from "./type-guards"

export function clone<T>(obj: T): T {
    if (!obj) return obj

    if (obj instanceof Date) return new Date(obj.valueOf()) as T

    if (Array.isArray(obj)) {
        return obj.map(item => clone(item)) as T
    }

    if (isObject(obj)) {
        const out: Record<string, unknown> = {}
        for (const key of Object.keys(obj)) {
            out[key] = clone((obj as Record<string, unknown>)[key])
        }
        return out as T
    }

    return obj
}
