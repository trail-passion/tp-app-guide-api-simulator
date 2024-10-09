/**
 * Conversion is opiniated:
 * * If `v` is undefined, return `defaultValue`.
 * * If `v` is a number, return __true__ only if this number is not equal to zero.
 * * If `v` is a string, return __true__ only if it's lowercased/trimed value is "true" or "yes".
 * * Stringified numbers are considered as real numbers. Therefore, they return __false__ only if equal to zero.
 *
 * @param v Any value you want to convert into a boolean.
 * @param defaultValue Value to return if `v` is undefined.
 */
export default function(v: any, defaultValue = false): boolean {
    switch (typeof v) {
        case "undefined":
            return defaultValue
        case "boolean":
            return v
        case "number":
            return v !== 0
        case "string":
            const text = v.trim().toLowerCase()
            if (text === "true" || text === "yes") return true
            const num = parseInt(text, 10)
            if (!isNaN(num)) return num !== 0

            return false
        default:
            return false
    }
}
