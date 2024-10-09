import GenericEvent from "../tools/generic-event"

export interface IGpsPosition {
    latitude: number
    longitude: number
    elevation: number | null
    accuracy: number
    timestamp: number
}

class GpsManager {
    public readonly eventPosition = new GenericEvent<IGpsPosition>()
    public readonly eventEnabled = new GenericEvent<boolean>()
    public readonly eventError = new GenericEvent<GeolocationPositionError>()
    private _enabled = false
    private _interval = 3000

    get enabled() {
        return this._enabled
    }
    set enabled(value: boolean) {
        if (this._enabled === value) return

        this._enabled = value
        this.getPosition()
        this.eventEnabled.fire(value)
    }

    get interval() {
        return this._interval
    }
    set interval(value: number) {
        this._interval = Math.max(1000, value)
    }

    private readonly getPosition = () => {
        navigator.geolocation.getCurrentPosition(
            this.handleSuccess,
            this.handleError,
            {
                enableHighAccuracy: true,
            }
        )
    }

    private readonly handleSuccess = (position: GeolocationPosition) => {
        if (!this.enabled) return

        this.eventPosition.fire({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            elevation: position.coords.altitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
        })
        window.setTimeout(this.getPosition, this.interval)
    }

    private readonly handleError = (error: GeolocationPositionError) => {
        this.eventError.fire(error)
        if (error.code === error.PERMISSION_DENIED) {
            this.enabled = false
        } else if (this.enabled) {
            window.setTimeout(this.getPosition, this.interval)
        }
    }
}

const manager = new GpsManager()
export default manager
