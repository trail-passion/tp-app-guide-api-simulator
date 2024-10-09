import Service from "../service"
import { isNumberArray } from "../../tools/type-guards"

const COMMON_ICONS = "LSGCAHZVDKPIJBM"

export default {
    /**
     * List all the user curstom icons.
     * @returns An array with exactly 100 elements.
     * Each one can be null, or the the URL of an icon.
     */
    async list(): Promise<Array<string | null>> {
        const icons: Array<string | null> = new Array(100)
        const userId = Service.user?.id ?? 0
        if (userId > 0) {
            const indexes = await Service.exec("tp4.Icon", {
                usr: userId,
            })
            if (isNumberArray(indexes)) {
                for (const idx of indexes) {
                    if (idx < 0 || idx > icons.length - 1) continue

                    icons[idx] = `/tfw/pub/icons/${userId}/${idx}.png`
                }
            }
        }
        // We fill the custom icons with common ones.
        const commonIcons = COMMON_ICONS.split("").map(
            x => `/css/gfx/ravitos/mrk-${x}.png`
        )
        for (let idx = 0; idx < icons.length; idx++) {
            if (icons[idx]) continue

            const icon = commonIcons.shift()
            if (!icon) break

            icons[idx] = icon
        }
        return icons
    },
}
