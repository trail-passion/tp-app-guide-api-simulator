import State from "../../state"
import { IGeoLocation } from "../../types"

export async function ApiGetLocation(): Promise<IGeoLocation> {
    return State.select(state => state.geoLocation)
}
