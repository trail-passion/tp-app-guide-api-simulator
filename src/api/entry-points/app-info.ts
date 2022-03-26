import State from "../../state"
import { IApplicationPackage } from "@/types"

export async function ApiGetAppInfo(): Promise<IApplicationPackage | null> {
    return State.select(state => state.applicationPackage)
}