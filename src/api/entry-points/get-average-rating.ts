import Service from "tp-lib/service/service"
import { assertNumberArray, assertObject } from "tp-lib/tools/type-guards"
import { IAverageRating } from "@/types"

export async function ApiGetAverageRating(
    traceId: number
): Promise<IAverageRating> {
    const result = await Service.exec("tp.rating.average", {
        traces: [traceId],
    })
    if (!isAverageRatingResult(result)) {
        console.error(result)
        throw Error("Bad RatingAverageResult!")
    }

    return {
        rating: result.averages[0],
        count: result.counts[0],
    }
}

interface AverageRatingResult {
    traces: number[]
    averages: number[]
    counts: number[]
}

function isAverageRatingResult(data: unknown): data is AverageRatingResult {
    try {
        assertObject(data)
        const { traces, averages, counts } = data
        assertNumberArray(traces, "traces")
        assertNumberArray(averages, "averages")
        assertNumberArray(counts, "counts")
        return true
    } catch (ex) {
        console.error(ex)
        return false
    }
}
