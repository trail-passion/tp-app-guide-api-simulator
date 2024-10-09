import * as React from "react"
import ProfileManager, { ProfileSelection } from "./profile-manager"
import { GeoPoint, TraceData } from "tp-lib/types"
import "./profile-view.css"

export interface ProfileViewSelection {
    fromIndex: number
    toIndex: number
}

export interface ProfileViewProps {
    className?: string
    trace: TraceData
    transparent: boolean
    selection?: ProfileViewSelection
    onSelectionChange?(selection: ProfileViewSelection): void
    onCenter(point: GeoPoint): void
}

export default function ProfileView(props: ProfileViewProps) {
    const { trace, onSelectionChange, onCenter } = props
    const [selection, setSelection] = React.useState<null | ProfileSelection>(
        null
    )
    const refCanvas = React.useRef<null | HTMLCanvasElement>(null)
    React.useEffect(
        () => setSelection(getInitialSelection(trace, props.selection)),
        [props.selection]
    )
    React.useEffect(() => {
        const canvas = refCanvas.current
        if (!canvas) return

        const handleSelectionChange = (s: ProfileSelection) => {
            setSelection(s)
            if (onSelectionChange)
                onSelectionChange({
                    fromIndex: s.startIndex,
                    toIndex: s.endIndex,
                })
        }
        const profileManager = new ProfileManager(trace, canvas)
        profileManager.eventSelectionChanged.add(handleSelectionChange)
        const handleCenter = (index: number) => {
            onCenter({
                lat: trace.lat[index],
                lng: trace.lng[index],
            })
        }
        profileManager.eventDoubleClick.add(handleCenter)
        return () => {
            profileManager.detach()
            profileManager.eventSelectionChanged.remove(handleSelectionChange)
            profileManager.eventDoubleClick.remove(handleCenter)
        }
    }, [trace, onSelectionChange])
    if (trace.profil === false && !Array.isArray(trace.alt)) return null

    return (
        <div className={getClassNames(props)}>
            <canvas ref={refCanvas}></canvas>
            {selection && (
                <div
                    style={{
                        left: `${selection.startX}%`,
                        width: `${selection.endX - selection.startX}%`,
                    }}
                ></div>
            )}
        </div>
    )
}

function getClassNames(props: ProfileViewProps): string {
    const classNames = ["custom", "view-ProfileView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.transparent === true) classNames.push("transparent")

    return classNames.join(" ")
}

function getInitialSelection(
    trace: TraceData,
    selection?: ProfileViewSelection
): ProfileSelection | null {
    if (!selection || !trace.dis) return null

    const dis0 = trace.dis[0]
    const disA = trace.dis[selection.fromIndex] - dis0
    const disB = trace.dis[selection.toIndex] - dis0
    const dis = trace.dis[trace.dis.length - 1] - dis0
    return {
        startIndex: selection.fromIndex,
        endIndex: selection.toIndex,
        startX: (100 * disA) / dis,
        endX: (100 * disB) / dis,
    }
}
