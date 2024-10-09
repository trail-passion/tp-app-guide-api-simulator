import castFloat from "../tools/converter/double"
import { ITrace } from "tp-lib/types"

const MIN_NB_POINTS = 6
const DEFAULT_RADIUS_FRACTION_OF_TOTAL = 32

/**
 * Rechercher dans  une trace les sommets  et les combes en  se basant
 * sur les altitudes et les distances.
 * Un pic brut  est un point de rebroussement entre  une montée et une
 * descente. Parmi  eux, nous ne  gardons que  ceux qui sont  les plus
 * hauts (ou plus bas) dans un rayon de `radius` mètres.
 *
 * * "trace.alt" - Les altitudes en mètres.
 * * "trace.dis" - Les distances en mètres.
 * * "radius" -  Le rayon  de validité  pour un  pic
 *      (par défaut 1/32 ème de la distance totale).
 *
 * Return un tableau d'indices  désignant les points pics. Si
 * l'indice est négatif, il s'agit d'une combe.
 */
export default function findPeaks(trace: ITrace, optionalRadius?: number) {
    if (!trace) return []
    if (!Array.isArray(trace.alt)) return []
    if (trace.alt.length < MIN_NB_POINTS) return []
    if (!Array.isArray(trace.dis)) return []
    if (trace.dis.length < MIN_NB_POINTS) return []
    const alt = trace.alt
    const dis = trace.dis
    const begin = dis[0]
    const end = dis[dis.length - 1]

    const radius = castFloat(
        optionalRadius,
        (end - begin) / DEFAULT_RADIUS_FRACTION_OF_TOTAL
    )

    let peaks: number[] = []
    let a = 0
    let m = alt[0]
    let b = alt[1]
    for (let i = 1; i < trace.alt.length; i++) {
        a = m
        m = b
        b = alt[i + 1]
        const slopeL = m - a
        const slopeR = b - m
        if (slopeL === 0 && slopeR === 0) {
            // C'est une portion plate.
            continue
        }
        if (slopeL <= 0 && slopeR >= 0) {
            // C'est une combe.
            peaks.push(-i)
        } else if (slopeL >= 0 && slopeR <= 0) {
            // C'est un sommet.
            peaks.push(i)
        }
    }

    // On va  maintenant filtrer pour  ne garder  que les pics  les plus
    // importants.
    const filteredPeaks = peaks.filter(function (idx) {
        // Attention ! `idx` peut être négatif.
        const isBottom = idx < 0
        const index = Math.abs(idx)
        const currentDis = dis[index]
        // Pas de pic dans les `radius` premiers mètres.
        if (currentDis - begin < radius) return false
        // Pas de pic dans les `radius` derniers mètres.
        if (end - currentDis < radius) return false
        const currentAlt = alt[index]
        // Index à utiliser pour étudier le voisinage.
        if (isBottom) {
            // Tester une combe pour voir si c'est bien le point le plus bas
            // dans un rayon de `radius` mètres.
            // A gauche.
            let k = index - 1
            while (currentDis - dis[k] < radius) {
                if (alt[k] < currentAlt) return false
                k--
            }
            // A droite.
            k = index + 1
            while (dis[k] - currentDis < radius) {
                if (alt[k] < currentAlt) return false
                k++
            }
        } else {
            // Tester une  sommet pour voir si  c'est bien le point  le plus
            // haut dans un rayon de `radius` mètres.
            // A gauche.
            let k = index - 1
            while (currentDis - dis[k] < radius) {
                if (alt[k] > currentAlt) return false
                k--
            }
            // A droite.
            k = index + 1
            while (dis[k] - currentDis < radius) {
                if (alt[k] > currentAlt) return false
                k++
            }
        }
        return true
    })

    // Les  commet et  les combes  devraient être  alternés. Mais  si ce
    // n'est pas le cas, on garde le  plus haut sommet d'une série et la
    // plus profonde combe d'une série.
    peaks = []
    filteredPeaks.forEach(function (index) {
        if (peaks.length === 0) {
            peaks.push(index)
            return
        }
        const k = Math.abs(index)
        const lastIdx = peaks[peaks.length - 1]
        const lastAlt = alt[Math.abs(lastIdx)]
        if (index > 0) {
            // C'est un sommet. Vérifions que le précédent en soit aussi.
            if (lastIdx < 0) {
                // Il y a alternance.
                peaks.push(index)
                return
            }
            if (alt[k] > lastAlt) {
                // On est plus haut que le sommet précédent.
                peaks[peaks.length - 1] = index
            }
        } else {
            // C'est une combe. Vérifions que le précédent en soit aussi.
            if (lastIdx > 0) {
                // Il y a alternance.
                peaks.push(index)
                return
            }
            if (alt[k] < lastAlt) {
                // On est plus bas que la combe précédente.
                peaks[peaks.length - 1] = index
            }
        }
    })

    return peaks
}
