import Service from "../service"
import { IBib, IBibGender } from "./types"
import { isArray, isNumber, isObject } from "../../tools/type-guards"
/**
 * Bibs related service.
 */

const MISSING_TRACE = 1
const UNKNOWN_TRACE = 2
const MISSING_EVENT = 3
const UNEXPECTED_ERROR = 4

export default {
    list,
    MISSING_TRACE,
    UNKNOWN_TRACE,
    MISSING_EVENT,
    UNEXPECTED_ERROR,
}

async function list(eventId: number, traceId: number): Promise<IBib[]> {
    const bibs = await Service.exec("tp4.Bib", {
        event: eventId,
        trace: traceId,
    })
    if (!isNumber(bibs)) {
        // Error code.
        switch (bibs) {
            case 1:
                throw MISSING_TRACE
            case 2:
                throw UNKNOWN_TRACE
            case 10:
                throw MISSING_EVENT
            default:
                throw UNEXPECTED_ERROR
        }
    }
    if (!isBibProtocol(bibs)) {
        console.error("tp4.Bib returned an invalid data:", bibs)
        return []
    }

    const GENDER_MAPPING: Array<IBibGender> = [
        "M",
        "F",
        "X",
        "TM",
        "TF",
        "TX",
    ]

    const output = bibs.bib.map((bib: number, idx: number) => ({
        traceId,
        eventId,
        num: bib,
        firstname: bibs.firstname[idx],
        lastname: bibs.lastname[idx],
        year: bibs.year[idx],
        gender: GENDER_MAPPING[bibs.female[idx]] ?? "X",
        category: bibs.category[idx],
    }))

    return output
}

interface BibProtocol {
    bib: number[]
    firstname: string[]
    lastname: string[]
    year: number[]
    female: number[]
    category: string[]
}

function isBibProtocol(data: unknown): data is BibProtocol {
    if (!isObject(data)) return false
    const { bib, firstname, lastname, year, female, category } = data
    if (!isArray(bib)) return false
    if (!isArray(firstname)) return false
    if (!isArray(lastname)) return false
    if (!isArray(year)) return false
    if (!isArray(female)) return false
    if (!isArray(category)) return false
    return true
}
