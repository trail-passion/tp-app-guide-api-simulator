import * as React from "react"
import Cursor from "./cursor.png"
import { MapManager } from "tp-lib/map"
import State from "@/state"
import { IGeoLocation } from "@/types"
import { IGeoPoint } from "tp-lib/types"
import { isGeoLocation } from "../../type-guard"
import { PrefixedLocalStorage } from "tp-lib/tools/storage"

const Storage = new PrefixedLocalStorage("tour/State/")

export function useGpsMarker(
    map: MapManager | null,
    geoLocation: IGeoLocation,
    updateGeoLocation: (value: Partial<IGeoLocation>) => void
) {
    React.useEffect(() => {
        if (!map) return

        map.marker.clear()
        map.marker.add({
            lat: geoLocation.lat,
            lng: geoLocation.lng,
            icon: {
                url: Cursor,
                anchor: [15, 15],
                size: [31, 31],
            },
        })
    }, [map, geoLocation])
    React.useEffect(() => {
        if (!map) return

        const handleTap = (point: IGeoPoint) => {
            updateGeoLocation({ lat: point.lat, lng: point.lng })
        }
        map.eventTap.add(handleTap)
        return () => map.eventTap.remove(handleTap)
    }, [map])
}

export function useGeoLocation(): [
    geoLocation: IGeoLocation,
    updateGeoLocation: (value: Partial<IGeoLocation>) => void,
] {
    const [geoLocation, setGeoLocation] = React.useState<IGeoLocation>(
        getInitialGeoLocation()
    )
    const updateGeoLocation = (value: Partial<IGeoLocation>) => {
        const newLocation = {
            ...geoLocation,
            ...value,
        }
        setGeoLocation(newLocation)
        Storage.set("geo-location", newLocation)
        State.update({ geoLocation: newLocation })
    }
    return [geoLocation, updateGeoLocation]
}

function getInitialGeoLocation(): IGeoLocation {
    const geoLocation = Storage.get("geo-location", null)
    return isGeoLocation(geoLocation)
        ? geoLocation
        : {
              status: "on",
              lat: 0,
              lng: 0,
              alt: 0,
              speed: 0,
              accuracy: 10,
              altitudeAccuracy: 100,
              timestamp: Date.now(),
          }
}
