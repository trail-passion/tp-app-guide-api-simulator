import { ISearchCriteria } from "tp-lib/types"
import castArray from "./converter/array"
import castInteger from "./converter/integer"

const ALPHABET = "abcdefghijklmnopqrstuvwxyzàâäéèêëìîïòôöùûüñçß"
const KEYS_ALIASES: { [key: string]: "km" | "asc" | "dsc" } = {
    km: "km",
    mi: "km",
    d: "asc",
    "d+": "asc",
    "d-": "dsc",
}

export default { split, matchCrit, textToCriteria }

const LATIN = "abcdefghijklmnopqrstuvwxyzàâäéèêëìîïòôöùûüñçß"
const GREEK = "ΑαΒβΓγΔδΕεΖζΗηΘθΙιΚκΛλΜμΝνΞξΟοΠπΡρΣσςΤτΥυΦφΧχΨψΩω"
const RX_NOT_ALPHA = new RegExp(`[^${LATIN}${GREEK}0-9]+`, "ig")

/**
 * Split a text into words. A word is exclusively made of alphabetical characters
 * @param  text [description]
 * @return      [description]
 */
function split(text: string): string[] {
    return text
        .trim()
        .toLowerCase()
        .split(RX_NOT_ALPHA)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
}

function matchCrit(text: string, criteria: string[]): boolean {
    if (!Array.isArray(criteria) || criteria.length === 0) return true
    const normalizedText = text.trim().toLowerCase()
    for (const criterium of criteria) {
        const index = normalizedText.indexOf(criterium.toLowerCase())
        if (index === -1) return false
    }
    return true
}

function normalizeSearchOptions(
    searchString: string | Partial<ISearchCriteria>
): ISearchCriteria {
    const options: ISearchCriteria = {
        id: [],
        modes: "all",
        limit: 12,
        page: 0,
        km: [0, 0],
        asc: [0, 0],
        dsc: [0, 0],
        name: [],
        group: [],
        ...(typeof searchString === "string"
            ? { name: searchString }
            : searchString),
    }
    return options
}

/**
 * @param txt - Search text to convert in a criteria object.
 */
function textToCriteria(
    searchString: string | Partial<ISearchCriteria>
): ISearchCriteria {
    const options = normalizeSearchOptions(searchString)

    options.name = castArray(options.name).map((name) =>
        name.trim().toLowerCase()
    )
    const tokens = tokenize(options)

    while (tokens.hasTokens()) {
        if (tokens.isGreaterThanValue()) {
            const [value, unit] = tokens.nextValueUnitSkipingOperator()
            const att = KEYS_ALIASES[unit]
            options[att][0] = value
        } else if (tokens.isLowerThanValue()) {
            const [value, unit] = tokens.nextValueUnitSkipingOperator()
            const att = KEYS_ALIASES[unit]
            options[att][1] = value
        } else if (tokens.isEqualToValue()) {
            const [value, unit] = tokens.nextValueUnit()
            const att = KEYS_ALIASES[unit]
            const LOWER_BOUND = 0.9
            const UPPER_BOUND = 1.1
            options[att][0] = value * LOWER_BOUND
            options[att][1] = value * UPPER_BOUND
        } else {
            options.name.push(`${tokens.next()}`)
        }
    }

    // Remove unused filters.
    const result: Partial<ISearchCriteria> = {}
    addIfNotEmptyRange(options, result, "km")
    addIfNotEmptyRange(options, result, "asc")
    addIfNotEmptyRange(options, result, "dsc")

    console.info("[tp4.trace-finder] options=...", options)
    return options
}

function addIfNotEmptyRange(
    src: ISearchCriteria,
    dst: Partial<ISearchCriteria>,
    att: "km" | "asc" | "dsc"
) {
    const [a, b] = src[att]
    if (a <= 0 && b <= 0) return
    dst[att] = [Math.min(a, b), Math.max(a, b)]
}

class Tokens {
    private readonly end: number
    private cur = 0

    constructor(private readonly tokens: Array<string | number>) {
        this.end = tokens.length
    }

    hasTokens() {
        return this.cur < this.end
    }

    static isKnownUnit(unit: string | number | null): boolean {
        if (typeof unit !== "string") return false
        switch (unit) {
            case "km":
            case "mi":
            case "d":
            case "d+":
            case "d-":
                return true
            default:
                return false
        }
    }

    /**
     * Return `true` if the next token is a number
     * and the next one is "km", "mi", "d", "d+" or "d-".
     */
    isEqualToValue(): boolean {
        if (typeof this.peek() !== "number") return false
        return Tokens.isKnownUnit(this.peek(1))
    }

    /**
     * Return `true` if the next token is "<", the next is a number
     * and the next one is "km", "mi", "d", "d+" or "d-".
     */
    isLowerThanValue(): boolean {
        if (this.peek() !== "<") return false
        if (typeof this.peek(1) !== "number") return false
        const LAST_ITEM = 2
        return Tokens.isKnownUnit(this.peek(LAST_ITEM))
    }

    /**
     * Return `true` if the next token is ">", the next is a number
     * and the next one is "km", "mi", "d", "d+" or "d-".
     */
    isGreaterThanValue(): boolean {
        if (this.peek() !== ">") return false
        if (typeof this.peek(1) !== "number") return false
        const LAST_ITEM = 2
        return Tokens.isKnownUnit(this.peek(LAST_ITEM))
    }

    next(): string | number | null {
        const { cur, end, tokens } = this
        if (cur < end) {
            this.cur++
            return tokens[cur]
        }
        return null
    }

    nextValueUnitSkipingOperator(): [number, string] {
        this.next()
        return this.nextValueUnit()
    }

    nextValueUnit(): [number, string] {
        const value = castInteger(this.next(), 0)
        const unit = `${this.next() || ""}`
        if (unit === "mi") {
            const MILES_TO_KILOMETERS = 1.609344
            return [value * MILES_TO_KILOMETERS, "km"]
        }
        return [value, unit]
    }

    peek(shift: number = 0): string | number | null {
        const { cur, end, tokens } = this
        const idx = cur + shift
        return idx < end ? tokens[idx] : null
    }

    back() {
        this.cur = Math.max(0, this.cur)
    }
}

function tokenize(options: ISearchCriteria): Tokens {
    // Essayer de trouver des éléments de filtres.
    // Par exemple "trail 10 km".
    const tokens: Array<number | string> = []
    let cursor = 0
    if (typeof options.name !== "string") return new Tokens(tokens)

    for (let i = 0; i < options.name.length; i++) {
        const c = options.name.charAt(i)
        if ("<>=".indexOf(c) !== -1) {
            tokens.push(c)
        } else if (c >= "0" && c <= "9") {
            cursor = i
            for (; i < options.name.length; i++) {
                const digit = options.name.charAt(i)
                if (digit < "0" || digit > "9") break
            }
            tokens.push(parseInt(options.name.substr(cursor, i - cursor), 10))
            i--
        } else if (ALPHABET.indexOf(c) > -1) {
            cursor = i
            for (; i < options.name.length; i++) {
                const char = options.name.charAt(i)
                if (ALPHABET.indexOf(char) === -1) break
            }
            let piece = options.name.substr(cursor, i - cursor)
            if (piece === "d") {
                if (c === "+" || c === "-") {
                    piece += c
                    i++
                }
            }
            tokens.push(piece)
            i--
        }
    }
    return new Tokens(tokens)
}

function getArray(item: ISearchCriteria, key: string): [number, number] {
    if (!item) return [0, 0]
    switch (key) {
        case "km":
            return item.km || [0, 0]
        case "asc":
            return item.asc || [0, 0]
        case "dsc":
            return item.dsc || [0, 0]
        default:
            return [0, 0]
    }
}
