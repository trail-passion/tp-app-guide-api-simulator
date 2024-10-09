import { computeDistance } from "../geo-tools"
import { ensureNumber } from "../tools/type-guards"
import { TraceData } from "tp-lib/types"

const TO_PERCENT = 0.01
const SECONDS_PER_MINUTE = 60
const DEFAULT_ELEVATION_THRESHOLD = 15

/*
 * Change the times to simulate a real journey.
 * @param data 3d GPS position (lat, lng, alt).
 * @param start Start time in minutes from midnight.
 * @param rawDuration Duration in minutes.
 * @param rawTireness Percentage from -99 to 100.
 */
export function computeTheoreticalTimes(
    trace: TraceData,
    start: number,
    rawDuration: number,
    rawTireness: number
) {
    const tim = [0] // Resulting array of times expressed in seconds
    let pause = 0 // Total pausing time in minutes.
    let duration = rawDuration

    // Ajouter les éventuels temps de pause pour chaque ravito.
    // Ces temps de pause sont exprimés en minutes.
    for (const mrk of trace.markers) {
        pause += mrk.pause ?? 0
    }
    duration -= pause
    const tireness = rawTireness * TO_PERCENT

    // Recalculer les distances pour être sûr.
    let lastLat = trace.lat[0]
    let lastLng = trace.lng[0]
    if (!trace.dis) {
        // Pas de distance, alors on la calcule.
        trace.dis = [0]
        let dis = 0
        for (let index = 1; index < trace.lat.length; index++) {
            const lat = trace.lat[index]
            const lng = trace.lng[index]
            dis += computeDistance(lastLat, lastLng, lat, lng)
            trace.dis.push(dis)
            lastLat = lat
            lastLng = lng
        }
    }

    const distances = trace.dis

    const speedsByStep = computeSpeedsByStep(trace)
    const steps = speedsByStep.steps
    const speeds = speedsByStep.speeds
    const totalDis = trace.dis[trace.dis.length - 1] - trace.dis[0]
    let lastIdx = 0
    steps.forEach(function (idx, speedIndex) {
        // Vitesse sur le tronçon.
        let speed = speeds[speedIndex]
        // Calcul de la fatigue.
        speed *= 1 - (tireness * distances[idx]) / totalDis
        // Appliquer des temps théoriques.
        let k = lastIdx + 1
        while (k <= idx) {
            tim.push(
                tim[lastIdx] +
                    Math.ceil(
                        (ensureNumber(distances[k], 0) -
                            ensureNumber(distances[lastIdx], 0)) /
                            speed
                    )
            )
            k++
        }
        lastIdx = idx
    })

    // Maintenant on dilate/contracte pour obtenir le temps voulu.
    const base = start * SECONDS_PER_MINUTE
    const factor = (duration * SECONDS_PER_MINUTE) / tim[tim.length - 1]

    for (let i = 0; i < tim.length; i++) {
        tim[i] = base + Math.floor(factor * tim[i])
    }

    // Pour finir, il faut insérer les temps de pause.
    const pauses: number[][] = []
    pause = 0
    for (const mrk of trace.markers) {
        if (typeof mrk.index !== "number") continue

        if ((mrk.pause ?? 0) > 0) {
            pause += ensureNumber(mrk.pause, 0) * SECONDS_PER_MINUTE
            pauses.push([mrk.index + 1, pause])
        }
    }
    if (pauses.length > 0) {
        pauses.push([tim.length])
        for (let idxTxt = 0; idxTxt < pauses.length - 1; idxTxt++) {
            const begin = pauses[idxTxt]
            const end = pauses[idxTxt + 1]
            for (let i = begin[0]; i < end[0]; i++) {
                tim[i] += begin[1]
            }
        }
    }

    return tim
}

/**
 * Return relative speeds by steps. `{steps: [], speeds: []}`
 * * __steps__: Each item is a step and it is represented by the index of the last point of this step.
 * * __speeds__: Array of same length as `steps`. Relative speed of each step.
 */
function computeSpeedsByStep(data: TraceData) {
    const speeds: number[] = []
    const altitudes = data.alt
    const distances = data.dis

    // On considère des étapes par seuils de 20 mètres de dénivelé.
    // C'est pour calculer les pentes sur des portions assez grandes.
    const threshold = ensureNumber(
        data.elevationThreshold,
        DEFAULT_ELEVATION_THRESHOLD
    )
    let lastAlt = altitudes[0]
    let lastIdx = 0
    const steps: number[] = []
    let z = 0
    for (let i = 0; i < distances.length; i++) {
        const a = ensureNumber(altitudes[i], 0)
        z = a - lastAlt
        if (z > threshold) {
            // Dénivelé positif.
            speedUp(data, speeds, lastIdx, i)
            lastIdx = i
            lastAlt = a
            steps.push(ensureNumber(i, 0))
        } else if (-z > threshold) {
            // Dénivelé négatif.
            speedDown(data, speeds, lastIdx, i)
            lastIdx = i
            lastAlt = a
            steps.push(ensureNumber(i, 0))
        }
    }
    // Dernier tronçon.
    if (z > 0) {
        // Dénivelé positif.
        speedUp(data, speeds, lastIdx, distances.length - 1)
        steps.push(distances.length - 1)
    } else if (z <= 0) {
        // Dénivelé négatif.
        speedDown(data, speeds, lastIdx, distances.length - 1)
        steps.push(distances.length - 1)
    }

    return { steps, speeds }
}

const MIN_SPEED = 2.6
const FLAT_SPEED = 8 // 8 km/h when it's flat.
const FLAT_THRESHOLD = 0.08
const BIG_ASC = 0.27 // Une pente de 0.27 équivaut à la montée de Grande-Gorge.
const BIG_ASC_SPEED = 3 // Et il faut compter 3 km/h.

/**
 * Calcule la vitesse de course sur la portion montante [a, b] de la trace.
 */
function speedUp(data: TraceData, speeds: number[], a: number, b: number) {
    const { dis, alt } = data
    const m = dis[b] - dis[a] // Taille du tronçon en mètres.
    const d = alt[b] - alt[a] // Dénivelé du tronçon.
    const x = ensureNumber(d, 0) / ensureNumber(m, 1)
    let s = FLAT_SPEED // 8 km/h sur le plat.
    if (x > FLAT_THRESHOLD) {
        // Il ne s'agit plus de plat.
        s =
            FLAT_SPEED +
            ((BIG_ASC_SPEED - FLAT_SPEED) * (x - FLAT_THRESHOLD)) /
                (BIG_ASC - FLAT_THRESHOLD)
    }
    speeds.push(Math.max(MIN_SPEED, s))
}

const FAST_DSC_SLOPE = 0.12
const FAST_DSC_SPEED = 13
const HARD_DSC_SLOPE = 0.22 // Une pente de 0.22 équivaut à la descente d'Orjobet.
const HARD_DSC_SPEED = 8 // Et il faut compter 8 km/h.

/**
 * Calcule la vitesse de course sur la portion Descendante [a, b] de la trace.
 */
function speedDown(data: TraceData, speeds: number[], a: number, b: number) {
    const { dis, alt } = data
    const m = dis[b] - dis[a] // Taille du tronçon en mètres.
    const d = alt[a] - alt[b] // Dénivelé du tronçon.
    const x = ensureNumber(d, 0) / ensureNumber(m, 1)
    let s = FLAT_SPEED // 8 km/h sur le plat.
    if (x > FLAT_THRESHOLD) {
        // Il ne s'agit plus de plat.
        if (x < FAST_DSC_SLOPE) {
            // Jusqu'à une pente de 0.12, on accélère pour atteindre 13 km/h.
            s =
                FLAT_SPEED +
                ((FAST_DSC_SPEED - FLAT_SPEED) * (x - FLAT_THRESHOLD)) /
                    (FAST_DSC_SLOPE - FLAT_THRESHOLD)
        } else {
            // Une pente de 0.22 équivaut à la descente d'Orjobet
            // et il faut compter 8 km/h.
            s =
                FAST_DSC_SPEED +
                ((HARD_DSC_SPEED - FAST_DSC_SPEED) * (x - FAST_DSC_SLOPE)) /
                    (HARD_DSC_SLOPE - FAST_DSC_SLOPE)
        }
    }
    speeds.push(Math.max(MIN_SPEED, s))
}
