import Service from "../service"
import {
    assertNumberArray,
    assertObject,
    assertString,
    assertStringArray,
} from "../../tools/type-guards"

export interface TraceRating {
    /** Average rating as a float number between 1 and 5 */
    value: number
    /** Number of votes */
    count: number
}

export interface RatingModerationItem {
    traceId: number
    mobileId: string
    response: string
    comment: string
    rating: number
    date: number
}

async function getRatingsToModerate(
    traceIds: number[]
): Promise<RatingModerationItem[] | null> {
    try {
        const data = await Service.exec("tp.rating.moderation.get", {
            traces: traceIds,
        })
        assertTpRatingModerationGet(data)
        const list: RatingModerationItem[] = []
        data.traceIds.forEach((traceId, k) => {
            list.push({
                traceId,
                mobileId: data.mobileIds[k],
                response: data.responses[k],
                comment: data.comments[k],
                rating: data.ratings[k],
                date: data.dates[k],
            })
        })
        return list
    } catch (ex) {
        console.error(ex)
        return null
    }
}

async function setRatingState(
    traceId: number,
    mobileId: string,
    state: string,
    response: string
): Promise<unknown> {
    return Service.exec("tp.rating.moderation.set", {
        traceId,
        mobileId,
        state,
        response,
    })
}

async function getRatingAveragesForTraceIds(
    ids: number[]
): Promise<{ [id: number]: TraceRating }> {
    try {
        const data = await Service.exec("tp.rating.average", { traces: ids })
        assertTpRatingAverageResult(data)
        const ratings: { [id: number]: TraceRating } = {}
        for (let i = 0; i < data.traces.length; i++) {
            ratings[data.traces[i]] = {
                value: data.averages[i],
                count: data.counts[i],
            }
        }
        return ratings
    } catch (ex) {
        console.error("Unable to get average rating for ids:", ids)
        console.error(ex)
        throw ex
    }
}

async function getRatingDetailsForTraceId(id: number): Promise<
    Array<{
        comment: string
        rating: number
        date: Date
    }>
> {
    try {
        const data = await Service.exec("tp.rating.comment", { trace: id })
        assertTpRatingCommentResult(data)
        const ratings: Array<{ comment: string; rating: number; date: Date }> =
            []
        for (let i = 0; i < data.comments.length; i++) {
            const comment = data.comments[i]
            const rating = data.ratings[i]
            const date: Date = parseDate(data.dates[i])
            ratings.push({
                comment,
                rating,
                date,
            })
        }
        return ratings
    } catch (ex) {
        console.error("Unable to get comment rating for id:", id)
        console.error(ex)
        throw ex
    }
}

export default {
    getRatingAveragesForTraceIds,
    getRatingDetailsForTraceId,
    getRatingsToModerate,
    setRatingState,
}

interface TpRatingAverageResult {
    traces: number[]
    averages: number[]
    counts: number[]
}

function assertTpRatingAverageResult(
    data: unknown
): asserts data is TpRatingAverageResult {
    assertObject(data)
    assertNumberArray(data.traces, `data.traces`)
    assertNumberArray(data.averages, `data.averages`)
    assertNumberArray(data.counts, `data.counts`)
}

interface TpRatingCommentResult {
    comments: string[]
    ratings: number[]
    dates: number[]
}

function assertTpRatingCommentResult(
    data: unknown
): asserts data is TpRatingCommentResult {
    assertObject(data)
    assertStringArray(data.comments, `data.comments`)
    assertNumberArray(data.ratings, `data.ratings`)
    assertNumberArray(data.dates, `data.dates`)
}

function parseDate(dateAsNumber: number): Date {
    const dateAsText = `${dateAsNumber}`
    const yy = parseInt(dateAsText.substring(0, 4))
    const mm = parseInt(dateAsText.substring(4, 6))
    const dd = parseInt(dateAsText.substring(6, 8))
    return new Date(yy, mm - 1, dd)
}

interface TpRatingModerationGet {
    traceIds: number[]
    mobileIds: string[]
    responses: string[]
    comments: string[]
    ratings: number[]
    dates: number[]
}

function assertTpRatingModerationGet(
    data: unknown
): asserts data is TpRatingModerationGet {
    assertObject(data)
    assertNumberArray(data.traceIds, `data.trceIds`)
    assertStringArray(data.mobileIds, `data.mobileIds`)
    assertStringArray(data.responses, `data.responses`)
    assertStringArray(data.comments, `data.comments`)
    assertNumberArray(data.ratings, `data.ratings`)
    assertNumberArray(data.dates, `data.dates`)
}
