import * as React from "react"

import { MapFilter } from "tp-lib/types"
import { MapManager } from "."
import { TranslateLib as Translate } from "tp-lib/translate"
import Modal from "../ui/modal"
import Button from "../ui/view/button"
import CancelIcon from "../ui/view/icons/cancel"
import MapButton from "./button"
import MapSource from "./source/source-map"

/**
 * Display a list of available map sources.
 * When the user clicks on a map preview, the selected source
 * is applied to the given MapManager `map` and the source id is returned.
 */
export function selectSource(map: MapManager): Promise<string> {
    return new Promise((resolve) => {
        const modal = Modal.show(
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexWrap: "wrap",
                    maxHeight: "100vh",
                    overflow: "auto",
                }}
            >
                {MapSource.all().map((id) => {
                    const source = MapSource.get(id)
                    if (!source) return null

                    const { lat, lng } = map.view.center
                    if (source.bounds) {
                        const { n, s, e, w } = source.bounds
                        if (lat > n || lat < s || lng > e || lng < w) {
                            return null
                        }
                    }
                    return (
                        <MapButton
                            key={source.id}
                            source={source}
                            lat={lat}
                            lng={lng}
                            zoom={map.view.zoom}
                            onClick={(source) => {
                                map.source = source
                                modal.hide()
                                resolve(map.source.id)
                            }}
                        />
                    )
                })}
                <Button
                    label={Translate.cancel}
                    icon={CancelIcon}
                    onClick={() => {
                        modal.hide()
                        resolve(map.source.id)
                    }}
                />
            </div>
        )
    })
}

const FLTER_LABELS = {
    none: "No filter",
    gray: "Grayscale (50%)",
    blur: "Grayscale (100%)",
    sepia: "Sepia",
    dark: "Dark",
    light: "Light",
}

export function selectFilter(map: MapManager): Promise<MapFilter> {
    return new Promise((resolve) => {
        const filters: MapFilter[] = [
            "none",
            "gray",
            "blur",
            "sepia",
            "dark",
            "light",
        ]
        const modal = Modal.show(
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexWrap: "wrap",
                    maxWidth: "1000px",
                    maxHeight: "100vh",
                    overflow: "auto",
                }}
            >
                {filters.map((filter) => {
                    const { lat, lng } = map.view.center
                    return (
                        <MapButton
                            key={filter}
                            source={map.source}
                            filter={filter}
                            label={FLTER_LABELS[filter] ?? filter}
                            lat={lat}
                            lng={lng}
                            zoom={map.view.zoom}
                            onClick={() => {
                                map.filter = filter
                                modal.hide()
                                resolve(filter)
                            }}
                        />
                    )
                })}
                <Button
                    label={Translate.cancel}
                    icon={CancelIcon}
                    onClick={() => {
                        modal.hide()
                        resolve(map.filter ?? "none")
                    }}
                />
            </div>
        )
    })
}
