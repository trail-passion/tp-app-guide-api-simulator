import * as React from "react"
import Expand from "tp-lib/ui/view/expand"
import Flex from "tp-lib/ui/view/flex"
import FloatingButton from "tp-lib/ui/view/floating-button"
import IconZoomIn from "tp-lib/ui/view/icons/zoom-in"
import IconZoomOut from "tp-lib/ui/view/icons/zoom-out"
import InputFloat from "tp-lib/ui/view/input/float"
import { MapManager } from "tp-lib/map"
import MapView from "tp-lib/map/view"
import SimpleCombo from "tp-lib/ui/view/simple-combo"
import { IApplicationPackage } from "../../types"
import { useAppState } from "../../state/state"
import { useGeoLocation, useGpsMarker } from "./hooks"

import "./gps-simulator-view.css"

export interface GpsSimulatorViewProps {
    className?: string
}

export interface IGeoLocation {
    status: string // "off" | "denied" | "unavailable" | "on"
    lat: number
    lng: number
    alt: number
    speed: number
    accuracy: number
    altitudeAccuracy: number
    timestamp: number
}

const FAKE_GEOLOCATION: IGeoLocation = {
    status: "off",
    lat: 0,
    lng: 0,
    alt: 0,
    speed: 0,
    accuracy: 10,
    altitudeAccuracy: 50,
    timestamp: 0,
}

export default function GpsSimulatorView(props: GpsSimulatorViewProps) {
    const applicationPackage = useAppState((s) => s.applicationPackage)
    const [map, setMap] = React.useState<null | MapManager>(null)
    const [sourceId, setSourceId] = React.useState("ignExpress")
    const [geoLocation, updateGeoLocation] = useGeoLocation()
    useGpsMarker(map, geoLocation, updateGeoLocation)
    const handleSourceIdChange = (newId: string) => {
        if (map && applicationPackage) {
            const source = applicationPackage.maps.find((s) => (s.id = newId))
            console.log("🚀 [gps-simulator-view] source = ", source) // @FIXME: Remove this line written on 2022-03-26 at 15:38
            if (source) map.source = source
        }
        setSourceId(newId)
    }
    const handleZoomIn = () => {
        if (!map) return

        map.view.zoomIn()
    }
    const handleZoomOut = () => {
        if (!map) return

        map.view.zoomOut()
    }
    const handleMapMount = (mapManager) => {
        setMap(mapManager)
    }
    return (
        <div className={getClassNames(props)}>
            <Flex justifyContent="flex-start" alignItems="center" wrap="wrap">
                <SimpleCombo
                    label="GPS Status"
                    options={{
                        on: "On",
                        off: "Off",
                        denied: "Denied",
                        unavailable: "Unavailable",
                    }}
                    value={geoLocation.status}
                    onChange={(status) => updateGeoLocation({ status })}
                />
                <InputFloat
                    label="Latitude"
                    value={geoLocation.lat}
                    onChange={(lat) => updateGeoLocation({ lat })}
                />
                <InputFloat
                    label="Longitude"
                    value={geoLocation.lng}
                    onChange={(lng) => updateGeoLocation({ lng })}
                />
                <SimpleCombo
                    label="Map Layer"
                    value={sourceId}
                    onChange={handleSourceIdChange}
                    options={makeMapOptions(applicationPackage)}
                />
            </Flex>
            <MapView className="map" onReady={handleMapMount}>
                <FloatingButton icon={IconZoomIn} onClick={handleZoomIn} />
                <FloatingButton icon={IconZoomOut} onClick={handleZoomOut} />
            </MapView>
        </div>
    )
}

function getClassNames(props: GpsSimulatorViewProps): string {
    const classNames = ["custom", "view-GpsSimulatorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function makeMapOptions(applicationPackage: IApplicationPackage | null): {
    [key: string]: string
} {
    const options: { [key: string]: string } = { "": "<Select a map layer>" }
    if (applicationPackage) {
        for (const source of applicationPackage.maps) {
            options[source.id] = source.name
        }
    }
    return options
}
