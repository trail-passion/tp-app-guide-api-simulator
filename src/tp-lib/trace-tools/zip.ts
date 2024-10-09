

export default {
    zipLatitudes,
    unzipLatitudes,
    zipLongitudes: zipLatitudes,
    unzipLongitudes: unzipLatitudes
}

const FLOAT_TO_INT = 1000000
const INT_TO_FLOAT = 1 / FLOAT_TO_INT
const HALF = 0.5

/**
 * All the latitudes are multiplied by 1'000'000 and floored.
 * We store only deltas.
 *
 * Input:  [3.12547575, 3.12449015, 3.12369374]
 * Output: [3125475, -985, -797]
 */
function zipLatitudes(latitudes: number[]): number[] {
    let lastValue = 0
    return latitudes.map(
        (latitude: number) => {
            const zippedLatitude = Math.floor(HALF + latitude * FLOAT_TO_INT)
            const delta = zippedLatitude - lastValue
            lastValue = zippedLatitude
            return delta
        }
    )
}

/**
 * All the latitudes are multiplied by 1'000'000 and floored.
 * We store only deltas.
 *
 * Input:  [3125475, -985, -797]
 * Output: [3.12547575, 3.12449015, 3.12369374]
 */
function unzipLatitudes(latitudes: number[]): number[] {
    let lastValue = 0
    return latitudes.map(
        (delta: number) => {
            const latitude = delta + lastValue
            lastValue = latitude
            return latitude * INT_TO_FLOAT
        }
    )
}
