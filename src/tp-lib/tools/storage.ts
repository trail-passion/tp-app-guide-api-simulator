import JSON5 from 'json5'

export class PrefixedLocalStorage {
    constructor(private readonly prefix: string = "") {}

    public get(name: string, defaultValue: unknown): unknown {
        try {
            const value = window.localStorage.getItem(name)
            if (value === null) return defaultValue

            return JSON5.parse(value)
        } catch (ex) {
            return defaultValue
        }
    }

    public set(name: string, value: unknown) {
        window.localStorage.setItem(name, JSON5.stringify(value))
    }
}

export class PrefixedSessionStorage {
    constructor(private readonly prefix: string = "") {}

    public get(name: string, defaultValue: unknown): unknown {
        try {
            const value = window.sessionStorage.getItem(name)
            if (value === null) return defaultValue

            return JSON5.parse(value)
        } catch (ex) {
            return defaultValue
        }
    }

    public set(name: string, value: unknown) {
        window.sessionStorage.setItem(name, JSON5.stringify(value))
    }
}