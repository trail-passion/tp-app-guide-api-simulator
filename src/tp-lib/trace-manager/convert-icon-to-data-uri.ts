import EmptyMarkerPng from "../gfx/empty-marker.png"

const globalDataIconCache = new Map<string, string>()

/**
 * Load an icon from `url` and return the DataURI of a 64x64 image.
 * In case of error, an empty image DataURI is returned.
 * URLs are stored in cache.
 */
export function convertIconURLToDataURI(url: string): Promise<string> {
    if (url.startsWith("css/") || url.startsWith("tfw/")) {
        // Fix relative URLs.
        url = `/${url}`
    }
    return new Promise(resolve => {
        const dataURI = globalDataIconCache.get(url)
        if (dataURI) {
            resolve(dataURI)
            return
        }

        const img = new Image()
        img.width = 64
        img.height = 64
        img.crossOrigin = "anonymous"
        img.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")
            if (ctx) ctx.drawImage(img, 0, 0, img.width, img.height)
            const dataURI = canvas.toDataURL("image/png")
            globalDataIconCache.set(url, dataURI)
            resolve(dataURI)
        }
        img.onerror = () => {
            console.error("Unable to find icon: ", url)
            const dataURI = EmptyMarkerPng
            globalDataIconCache.set(url, dataURI)
            resolve(dataURI)
        }
        img.src = url
    })
}
