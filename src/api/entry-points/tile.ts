import InvalidTile from "../../gfx/invalid-tile.png"
import State from "@/state"

export async function ApiGetTile(
    mapId: string,
    x: number,
    y: number,
    z: number
): Promise<string> {
    const tour = State.select(s => s.applicationPackage)
    if (!tour) return InvalidTile

    const map = tour.maps.find((m) => m.id === mapId) ?? tour.maps[0]
    if (!map) return InvalidTile

    let url: string = pick(map.urls)
    for (const [varName, text] of [
        ["x", `${x}`],
        ["y", `${y}`],
        ["z", `${z}`],
        ["k", map.key ?? ""],
    ]) {
        url = url.split(`{${varName}}`).join(text)
    }
    return url
}

function pick(urls: string[]): string {
    return urls[Math.floor(Math.random() * urls.length)]
}
