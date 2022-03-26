import State from "../../state"
import ToursService from "../../service/tours"

export async function ApiGetStoreVersion(): Promise<string> {
    return State.select(s => s.versionType)
}
