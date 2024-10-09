import * as React from "react"
import FloatingButton from "tp-lib/ui/view/floating-button"
import GpsManager, { IGpsPosition } from "tp-lib/gps"
import GpsOffIcon from "tp-lib/ui/view/icons/gps-off"
import GpsOnIcon from "tp-lib/ui/view/icons/gps-on"
import Modal from "tp-lib/ui/modal"
import { TranslateLib as Translate } from "tp-lib/translate"

import "./gps-button-view.css"

export interface GpsButtonViewProps {
    className?: string
    onPositionChange(position: { lat: number; lng: number }): void
}

export default function GpsButtonView(props: GpsButtonViewProps) {
    const [enabled, setEnabled] = React.useState(GpsManager.enabled)
    const handlePositionChange = React.useCallback((pos: IGpsPosition) => {
        props.onPositionChange({
            lat: pos.latitude,
            lng: pos.longitude,
        })
    }, [])
    React.useEffect(() => {
        GpsManager.eventError.add(handleError)
        GpsManager.eventEnabled.add(setEnabled)
        GpsManager.eventPosition.add(handlePositionChange)
        return () => {
            GpsManager.eventError.remove(handleError)
            GpsManager.eventEnabled.remove(setEnabled)
            GpsManager.eventPosition.remove(handlePositionChange)
        }
    }, [])
    return (
        <div className={getClassNames(props)}>
            <FloatingButton
                icon={enabled ? GpsOnIcon : GpsOffIcon}
                color={enabled ? "accent" : "primary"}
                onClick={() => (GpsManager.enabled = !GpsManager.enabled)}
            />
        </div>
    )
}

function getClassNames(props: GpsButtonViewProps): string {
    const classNames = ["custom", "view-GpsButtonView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function handleError(error: GeolocationPositionError) {
    if (error.code === error.PERMISSION_DENIED) {
        Modal.error(Translate.errorGpsPermissionDenied)
    }
}
