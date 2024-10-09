import * as React from "react"
import GenericEvent from "tp-lib/tools/generic-event"
import { IApplicationPackage, IGeoLocation, ITour } from "@/types"

export interface AppState {
    tours: ITour[]
    applicationId: number
    applicationPackage: null | IApplicationPackage
    versionType: string
    geoLocation: IGeoLocation
    userName: null | string
}

class State {
    private state: AppState = {
        tours: [],
        applicationId: 0,
        applicationPackage: null,
        /** "test" or "prod" */
        versionType: "test",
        geoLocation: {
            accuracy: 1000,
            alt: 0,
            lat: 0,
            lng: 0,
            speed: 0,
            altitudeAccuracy: 1000,
            status: "off",
            timestamp: 0,
        },
        userName: null,
    }

    public readonly eventChange = new GenericEvent<State>()

    update(state: Partial<AppState>) {
        this.state = {
            ...this.state,
            ...state,
        }
        this.eventChange.fire(this)
    }

    select<T>(selector: (state: AppState) => T): T {
        return selector(this.state)
    }

    getState() {
        return this.state
    }
}

const instance = new State()

export function useAppState<T>(selector: (state: AppState) => T): T {
    const [value, setValue] = React.useState(selector(instance.getState()))
    React.useEffect(() => {
        const apply = () => setValue(selector(instance.getState()))
        instance.eventChange.add(apply)
        return () => instance.eventChange.remove(apply)
    }, [instance])
    return value
}

export default instance
