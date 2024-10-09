import { isString } from "./type-guards"

type Validator = (arg: unknown) => boolean

export function makeOrValidator(...validators: Validator[]): Validator {
    return (arg: unknown) => {
        for (const validator of validators) {
            if (validator(arg)) return true
        }
        return false
    }
}

export function makeAndValidator(...validators: Validator[]): Validator {
    return (arg: unknown) => {
        for (const validator of validators) {
            if (!validator(arg)) return false
        }
        return true
    }
}

export function isURL(data: unknown): boolean {
    if (!isString(data)) return false
    if (data.startsWith("http://")) return true
    if (data.startsWith("https://")) return true
    return false
}

/**
 * @returns `true` is `data` is not a string or a string with nothing except spaces in it.
 */
export function isEmptyString(data: unknown): boolean {
    if (!isString(data)) return true
    return data.trim().length === 0
}

/**
 * @returns `false` is `data` is a string and a string with a non-null length.
 */
 export function isNotEmptyString(data: unknown): boolean {
    return !isEmptyString(data)
}
