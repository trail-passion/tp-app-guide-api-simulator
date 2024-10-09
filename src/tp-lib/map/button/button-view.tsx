import * as React from "react"
import { MapFilter, MapTileSource } from "tp-lib/types"
import MapView from "../view"

import "./button-view.css"

export interface ButtonViewProps {
    className?: string
    label?: string
    source: MapTileSource
    lat: number
    lng: number
    zoom: number
    filter?: MapFilter
    onClick(source: MapTileSource): void
}

export default function ButtonView(props: ButtonViewProps) {
    return (
        <button
            className={getClassNames(props)}
            onClick={() => props.onClick(props.source)}
        >
            <MapView
                enabled={false}
                filter={props.filter}
                onReady={(map) => {
                    if (props.source) map.source = props.source
                    map.view.center = props
                    map.view.zoom = props.zoom
                }}
            />
            <header>{props.label ?? props.source?.name}</header>
        </button>
    )
}

function getClassNames(props: ButtonViewProps): string {
    const classNames = ["custom", "map-ButtonView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
