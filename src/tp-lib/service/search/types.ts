import {
    assertArray,
    assertNumber,
    assertObject,
    assertString,
} from "../../tools/type-guards"

export interface ListTracesProtocol {
    count: number
    page: number
    limit: number
    all?: ListTracesModeProtocol
    last?: ListTracesModeProtocol
    mob?: ListTracesModeProtocol
    official?: ListTracesModeProtocol
    points?: ListTracesPointsProtocol
    private?: ListTracesModeProtocol
    public?: ListTracesModeProtocol
    rank?: ListTracesRankProtocol
}

export function assertListTracesProtocol(
    data: unknown,
    prefix = ""
): asserts data is ListTracesProtocol {
    assertObject(data, prefix)
    assertNumber(data.count, `${prefix}.count`)
    assertNumber(data.page, `${prefix}.page`)
    assertNumber(data.limit, `${prefix}.limit`)
    if (data.all) assertListTracesModeProtocol(data.all, `${prefix}.all`)
    if (data.last) assertListTracesModeProtocol(data.last, `${prefix}.last`)
    if (data.mob) assertListTracesModeProtocol(data.mob, `${prefix}.mob`)
    if (data.official)
        assertListTracesModeProtocol(data.official, `${prefix}.official`)
    if (data.points)
        assertListTracesPointsProtocol(data.points, `${prefix}.points`)
    if (data.private)
        assertListTracesModeProtocol(data.private, `${prefix}.private`)
    if (data.public)
        assertListTracesModeProtocol(data.public, `${prefix}.public`)
    if (data.rank) assertListTracesRankProtocol(data.rank, `${prefix}.rank`)
}

export interface ListTracesModeProtocol {
    I: number[]
    V: number[]
    Z: number[]
    N: string[]
    G: string[]
    U: string[]
    T: number[]
    "#": string[]
    "@": number[]
    K: number[]
    A: number[]
    D: number[]
    L: number[]
    Y: number[]
    X: number[]
    P: string[]
    M: number[]
    pack: string[]
    usr: number[]
}

export function assertListTracesModeProtocol(
    data: unknown,
    prefix = ""
): asserts data is ListTracesModeProtocol {
    assertObject(data, prefix)
    assertArray(data.I, `${prefix}.I`)
    assertArray(data.V, `${prefix}.V`)
    assertArray(data.Z, `${prefix}.Z`)
    assertArray(data.N, `${prefix}.N`)
    assertArray(data.G, `${prefix}.G`)
    assertArray(data.U, `${prefix}.U`)
    assertArray(data.T, `${prefix}.T`)
    assertArray(data.K, `${prefix}.K`)
    assertArray(data.A, `${prefix}.A`)
    assertArray(data.D, `${prefix}.D`)
    assertArray(data.L, `${prefix}.L`)
    assertArray(data.Y, `${prefix}.Y`)
    assertArray(data.X, `${prefix}.X`)
    assertArray(data.P, `${prefix}.P`)
    assertArray(data.M, `${prefix}.M`)
    assertArray(data.pack, `${prefix}.pack`)
    assertArray(data.usr, `${prefix}.usr`)
    assertArray(data["#"], `${prefix}.#`)
    assertArray(data["@"], `${prefix}.@`)
}

export interface ListTracesRankProtocol {
    /** User id */
    id: string[]
    /** User's nickname */
    nck: string[]
    /** User's email MD5 hash */
    md5: string[]
    /** Score based on traces' views */
    sco: number[]
    /** Number of traces for this user */
    nbt: number[]
    /** Number of users in the Database */
    count: number
}

export function assertListTracesRankProtocol(
    data: unknown,
    prefix = ""
): asserts data is ListTracesRankProtocol {
    assertObject(data, prefix)
    const { id, nck, md5, sco, nbt, count } = data
    assertArray(id, `${prefix}.id`)
    assertArray(nck, `${prefix}.nck`)
    assertArray(md5, `${prefix}.md5`)
    assertArray(sco, `${prefix}.sco`)
    assertArray(nbt, `${prefix}.nbt`)
    assertNumber(count, `${prefix}.count`)
}

export interface ListTracesPointsProtocol {
    id: number[]
    lat: number[]
    lng: number[]
    level: string
    official: string
    sport: string
}

export function assertListTracesPointsProtocol(
    data: unknown,
    prefix = ""
): asserts data is ListTracesPointsProtocol {
    assertObject(data, prefix)
    const { id, lat, lng, level, official, sport } = data
    assertArray(id, `${prefix}.id`)
    assertArray(lat, `${prefix}.lat`)
    assertArray(lng, `${prefix}.lng`)
    assertString(level, `${prefix}.level`)
    assertString(official, `${prefix}.official`)
    assertString(sport, `${prefix}.sport`)
}
