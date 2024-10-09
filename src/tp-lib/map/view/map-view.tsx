import * as React from "react"
import Async from "../../tools/async"
import MapManager from "../map"
import { MapFilter } from "tp-lib/types"
import "./map-view.css"

export interface MapViewProps {
    className?: string
    /** If not enabled, no mouse dragging nor wheel zooming. */
    enabled?: boolean
    filter?: MapFilter
    onReady(map: MapManager): void
    children?: JSX.Element | JSX.Element[]
}

export default function MapView(props: MapViewProps): JSX.Element {
    const refDiv = React.useRef<HTMLDivElement | null>(null)
    const [filter, setFilter] = React.useState(props.filter)
    React.useEffect(() => {
        const div = refDiv.current
        if (!div) {
            console.error("Div was not mounted!")
            return
        }

        const enabled = props.enabled ?? true
        const map = new MapManager(div, { enabled })
        map.eventFilterChange.add(setFilter)
        props.onReady(map)
        const debouncedMaprefresh = Async.Debouncer(() => map.refresh(), 200)
        const observer = new ResizeObserver(debouncedMaprefresh)
        observer.observe(div)
        return () => {
            map.eventFilterChange.remove(setFilter)
            observer.unobserve(div)
        }
    }, [])
    return (
        <div className={getClassNames(props, filter)}>
            <div ref={refDiv}></div>
            {props.children}
        </div>
    )
}

function getClassNames(props: MapViewProps, filter?: MapFilter): string {
    const classNames = ["custom", "guide-view-MapContainerView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (typeof filter === "string") {
        classNames.push(`filter-${filter}`)
    }

    return classNames.join(" ")
}
